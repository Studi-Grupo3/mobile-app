// Mock images for professors and students
// Maps slug (lowercase, no accents, hyphenated) to require() calls

export const professorImages = {
    'carlos-lima': require('../../assets/images/professors/carlos-lima.png'),
    'beatriz-costa': require('../../assets/images/professors/beatriz-costa.png'),
    'fernanda-alvez': require('../../assets/images/professors/fernanda-alvez.png'),
    'rodrigo-santos': require('../../assets/images/professors/rodrigo-santos.png'),
    'marina-oliveira': require('../../assets/images/professors/marina-oliveira.png'),
    'gustavo-pereira': require('../../assets/images/professors/gustavo-pereira.png'),
    'helena-moura': require('../../assets/images/professors/helena-moura.png'),
    'joao-neto': require('../../assets/images/professors/joao-neto.png'),
    'carla-mendes': require('../../assets/images/professors/carla-mendes.png'),
    'marcos-vinicius': require('../../assets/images/professors/marcos-vinicius.png'),
};

export const studentImages = {
    'matheus-alves': require('../../assets/images/students/matheus-alves.png'),
    'ana-beatriz-silva': require('../../assets/images/students/ana-beatriz-silva.png'),
    'lucas-ferreira': require('../../assets/images/students/lucas-ferreira.png'),
    'mariana-costa': require('../../assets/images/students/mariana-costa.png'),
    'gabriel-rocha': require('../../assets/images/students/gabriel-rocha.png'),
    'isabela-martins': require('../../assets/images/students/isabela-martins.png'),
    'rafael-gomes': require('../../assets/images/students/rafael-gomes.png'),
    'larissa-pereira': require('../../assets/images/students/larissa-pereira.png'),
    'pedro-albuquerque': require('../../assets/images/students/pedro-albuquerque.png'),
    'beatriz-ramos': require('../../assets/images/students/beatriz-ramos.png'),
};

/**
 * Get mock image for a professor by name.
 * Removes "Prof. " prefix, normalizes accents, converts to slug.
 */
export function getProfessorImage(name) {
    if (!name) return null;
    const slug = name
        .replace(/^Prof\.\s+/i, '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');
    return professorImages[slug] || null;
}

/**
 * Get mock image for a student by name.
 */
export function getStudentImage(name) {
    if (!name) return null;
    const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');
    return studentImages[slug] || null;
}
