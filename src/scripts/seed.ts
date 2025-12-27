import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    console.error("❌ Missing environment variables.");
    console.error(
        "   Make sure .env.local exists and has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
    );
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

async function seed() {
    console.log("🌱 Starting Database Seed...");

    try {
        // -------------------------------------------------------------------------
        // PHASE 1: CLEANUP
        // -------------------------------------------------------------------------
        console.log("🧹 Cleaning up old data...");

        // We delete in reverse order of dependencies to avoid Foreign Key constraint errors
        await supabase.from("challenge_options").delete().neq("id", 0);
        await supabase.from("exercises").delete().neq("id", 0);
        await supabase.from("lessons").delete().neq("id", 0);
        await supabase.from("units").delete().neq("id", 0);
        await supabase.from("courses").delete().neq("id", 0);

        console.log("   Cleanup complete.");

        // -------------------------------------------------------------------------
        // PHASE 2: PYTHON COURSE
        // -------------------------------------------------------------------------
        console.log("🐍 Creating Python Course...");

        const { data: pythonCourse, error: courseError } = await supabase
            .from("courses")
            .insert([
                {
                    title: "Python",
                    image_src: "/courses/python.png",
                    slug: "python",
                },
            ])
            .select()
            .single();

        if (courseError)
            throw new Error(`Failed to create course: ${courseError.message}`);

        // Create Unit
        const { data: pythonUnit } = await supabase
            .from("units")
            .insert([
                {
                    course_id: pythonCourse.id,
                    title: "Unit 1",
                    description: "Learn Python Basics",
                    order: 1,
                },
            ])
            .select()
            .single();

        const { data: pythonLessons } = await supabase
            .from("lessons")
            .insert([
                { unit_id: pythonUnit.id, order: 1, title: "Variables" },
                { unit_id: pythonUnit.id, order: 2, title: "Functions" },
                { unit_id: pythonUnit.id, order: 3, title: "Loops" },
            ])
            .select();

        // Create Exercise for Lesson 1 (Variables)
        const lessonVariables = pythonLessons!.find(
            (l) => l.title === "Variables",
        );

        const { data: pyExercise } = await supabase
            .from("exercises")
            .insert([
                {
                    lesson_id: lessonVariables!.id,
                    type: "SELECT",
                    question: "How do you print text in Python?",
                    image_src: null,
                    audio_src: null,
                },
            ])
            .select()
            .single();

        // Create Options
        await supabase.from("challenge_options").insert([
            {
                exercise_id: pyExercise.id,
                text: 'print("Hello")',
                correct: true,
                image_src: "/courses/python.png",
            },
            {
                exercise_id: pyExercise.id,
                text: 'console.log("Hello")',
                correct: false,
                image_src: "/courses/javascript.png",
            },
            {
                exercise_id: pyExercise.id,
                text: 'echo "Hello"',
                correct: false,
                image_src: null,
            },
        ]);

        // -------------------------------------------------------------------------
        // PHASE 3: JAVASCRIPT COURSE
        // -------------------------------------------------------------------------
        console.log("🟨 Creating JavaScript Course...");

        const { data: jsCourse } = await supabase
            .from("courses")
            .insert([
                {
                    title: "JavaScript",
                    image_src: "/courses/javascript.png",
                    slug: "javascript",
                },
            ])
            .select()
            .single();

        // Create Unit 1
        const { data: jsUnit1 } = await supabase
            .from("units")
            .insert([
                {
                    course_id: jsCourse.id,
                    title: "Unit 1",
                    description: "JS Fundamentals",
                    order: 1,
                },
            ])
            .select()
            .single();

        // Create Lessons
        const { data: jsLessons } = await supabase
            .from("lessons")
            .insert([
                {
                    unit_id: jsUnit1.id,
                    order: 1,
                    title: "Variables (let/const)",
                },
                { unit_id: jsUnit1.id, order: 2, title: "Arrow Functions" },
                { unit_id: jsUnit1.id, order: 3, title: "Arrays" },
            ])
            .select();

        // Create Exercise for Lesson 1
        const jsLesson1 = jsLessons![0];

        const { data: jsExercise } = await supabase
            .from("exercises")
            .insert([
                {
                    lesson_id: jsLesson1.id,
                    type: "SELECT",
                    question: "Which keyword declares a constant variable?",
                },
            ])
            .select()
            .single();

        await supabase.from("challenge_options").insert([
            {
                exercise_id: jsExercise.id,
                text: "const",
                correct: true,
                image_src: null,
            },
            {
                exercise_id: jsExercise.id,
                text: "let",
                correct: false,
                image_src: null,
            },
            {
                exercise_id: jsExercise.id,
                text: "var",
                correct: false,
                image_src: null,
            },
        ]);

        console.log("✅ Database seeded successfully!");
    } catch (err) {
        console.error("❌ Seed failed:", err);
        process.exit(1);
    }
}

seed();
