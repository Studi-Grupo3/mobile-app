function onlyDigits(str) {
    return str.replace(/\D/g, "");
}

export function validateStudentForm(formData) {
    const errors = [];

    const alunoPhone = onlyDigits(formData.cellphoneNumber || "");
    const respPhone = onlyDigits(formData.responsible.responsibleCellphoneNumber || "");
    const respCpf = onlyDigits(formData.responsible.responsibleCpf || "");

    if (alunoPhone && alunoPhone.length !== 11) {
        errors.push("O telefone do aluno deve conter 11 dígitos.");
    }

    if (respPhone && respPhone.length !== 11) {
        errors.push("O telefone do responsável deve conter 11 dígitos.");
    }

    if (respCpf && respCpf.length !== 11) {
        errors.push("O CPF do responsável deve conter 11 dígitos.");
    }

    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const dateValue = (formData.dateBirth || "").trim();

    if (dateValue && !dateRegex.test(dateValue)) {
        errors.push("A data de nascimento deve estar no formato DD/MM/AAAA.");
    }

    return errors;
}

export function formatDateToBackend(dateStr) {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateStr.trim());
    if (!match) return "";
    const [_, dd, mm, yyyy] = match;
    return `${yyyy}-${mm}-${dd}`;
}

export function formatDateToFrontend(dateStr) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
    if (!match) return dateStr;
    const [_, yyyy, mm, dd] = match;
    return `${dd}/${mm}/${yyyy}`;
}
