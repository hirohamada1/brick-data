/**
 * Contribution Test File
 * This file serves as a placeholder for initial contributions.
 */

/**
 * A simple greeting function for new contributors.
 * @param name - The name of the contributor
 * @returns A welcome message string
 */
export const welcomeContributor = (name: string): string => {
    const date = new Date().toLocaleDateString();
    return `Welcome, ${name}! Your contribution to brick-data on ${date} is appreciated.`;
};

// Example usage:
const contributorName = "Mattis";
console.log(welcomeContributor(contributorName));

export default welcomeContributor;
