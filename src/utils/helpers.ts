// Generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Select a random student who hasn't presented or given feedback yet
export const selectRandomStudent = (
  students: { id: string; name: string }[],
  excludeIds: string[]
): { id: string; name: string } | null => {
  const eligibleStudents = students.filter(
    (student) => !excludeIds.includes(student.id)
  );

  if (eligibleStudents.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * eligibleStudents.length);
  return eligibleStudents[randomIndex];
};
