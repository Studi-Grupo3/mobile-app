function validarCampos(nome, email, celular, cpf, senha, confirmacaoSenha) {
    return nome && email && celular && cpf && senha && confirmacaoSenha;
}

function validarNome(nome) {
    return nome.trim().length >= 2;
}

function validarEmail(email) {
    return email.includes("@");
}

function validarSenha(senha) {
    return senha.length >= 6 && /[A-Z]/.test(senha) && /[a-z]/.test(senha) && /\d/.test(senha);
}

function validarConfirmacaoSenha(senha, confirmacaoSenha) {
    return senha === confirmacaoSenha;
}

function mascararDataNascimento(value) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function mascararCpf(cpf) {
    return cpf
        .replace(/\D/g, '')
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
        .slice(0, 14);
}

function mascararCelular(telefone) {
    return telefone
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 15);
}

export {
    validarCampos,
    validarNome,
    validarEmail,
    validarSenha,
    validarConfirmacaoSenha,
    mascararDataNascimento,
    mascararCpf,
    mascararCelular
};
