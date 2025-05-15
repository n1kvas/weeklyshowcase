/**
 * Script to migrate localStorage data to Firestore
 *
 * This script helps migrate subjects and classes from localStorage to Firestore.
 * It can be run in the browser console when logged in as a teacher.
 */

// Copy and paste this script into your browser console when logged in as a teacher

async function migrateToFirestore() {
  console.log("Starting migration from localStorage to Firestore...");

  // Check if we have access to Firebase
  if (!firebase || !firebase.firestore) {
    console.error(
      "Firebase is not available. Make sure you are logged in and Firebase is loaded."
    );
    return;
  }

  const db = firebase.firestore();

  // Get data from localStorage
  const SUBJECTS_KEY = "weeklyShowcase_subjects";
  const localSubjects = JSON.parse(localStorage.getItem(SUBJECTS_KEY) || "[]");

  if (!localSubjects.length) {
    console.log("No subjects found in localStorage. Nothing to migrate.");
    return;
  }

  console.log(`Found ${localSubjects.length} subjects in localStorage.`);

  // Get the current user
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    console.error(
      "No user is logged in. Please log in as a teacher to migrate data."
    );
    return;
  }

  const userId = currentUser.uid;
  console.log(`Current user ID: ${userId}`);

  // Migrate each subject and its classes
  for (const subject of localSubjects) {
    try {
      console.log(`Migrating subject: ${subject.name} (${subject.id})`);

      // Check if subject already exists in Firestore
      const subjectRef = db.collection("subjects").doc(subject.id);
      const subjectDoc = await subjectRef.get();

      if (subjectDoc.exists) {
        console.log(
          `Subject ${subject.id} already exists in Firestore. Updating...`
        );

        // Update the subject with local data
        await subjectRef.update({
          name: subject.name,
          teacherId: userId,
          students: subject.students || [],
        });
      } else {
        console.log(`Creating new subject in Firestore: ${subject.name}`);

        // Create the subject in Firestore
        await subjectRef.set({
          id: subject.id,
          name: subject.name,
          teacherId: userId,
          students: subject.students || [],
          classes: [],
        });
      }

      // Migrate classes for this subject
      if (subject.classes && subject.classes.length) {
        console.log(
          `Migrating ${subject.classes.length} classes for subject ${subject.name}`
        );

        for (const classItem of subject.classes) {
          try {
            console.log(`Migrating class: ${classItem.name} (${classItem.id})`);

            // Check if class already exists in Firestore
            const classRef = db.collection("classes").doc(classItem.id);
            const classDoc = await classRef.get();

            if (classDoc.exists) {
              console.log(
                `Class ${classItem.id} already exists in Firestore. Updating...`
              );

              // Update the class with local data
              await classRef.update({
                name: classItem.name,
                subjectId: subject.id,
                lastSessionTimestamp: classItem.lastSessionTimestamp || null,
              });
            } else {
              console.log(`Creating new class in Firestore: ${classItem.name}`);

              // Create the class in Firestore
              await classRef.set({
                id: classItem.id,
                name: classItem.name,
                subjectId: subject.id,
                lastSessionTimestamp: classItem.lastSessionTimestamp || null,
              });
            }

            // Add class to subject's classes array if not already present
            const updatedSubjectDoc = await subjectRef.get();
            const subjectData = updatedSubjectDoc.data();
            const existingClasses = subjectData.classes || [];

            if (!existingClasses.some((c) => c.id === classItem.id)) {
              console.log(
                `Adding class ${classItem.id} to subject's classes array`
              );

              existingClasses.push({
                id: classItem.id,
                name: classItem.name,
                subjectId: subject.id,
                lastSessionTimestamp: classItem.lastSessionTimestamp || null,
              });

              await subjectRef.update({ classes: existingClasses });
            }
          } catch (classError) {
            console.error(
              `Error migrating class ${classItem.name}:`,
              classError
            );
          }
        }
      }

      console.log(`Successfully migrated subject: ${subject.name}`);
    } catch (subjectError) {
      console.error(`Error migrating subject ${subject.name}:`, subjectError);
    }
  }

  console.log("Migration complete!");
}

// How to use:
// 1. Login as a teacher
// 2. Open browser console (F12)
// 3. Copy and paste this entire script
// 4. Run the migrateToFirestore() function
console.log(
  "Migration script loaded. Run migrateToFirestore() to start migration."
);
