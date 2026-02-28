import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, ActivityIndicator, Alert, TouchableOpacity, StyleSheet, Clipboard } from 'react-native';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { mockTeacherManagerService as teacherManagerService } from '../../mocks/mockServices';
import { translateSubject, subjectNamesPt } from '../../utils/tradutionUtils';
import { UserPlus, Edit2, Trash2, RefreshCw, Copy, ChevronDown } from 'lucide-react-native';

export default function GerenciamentoProfessoresPage() {
    const [professores, setProfessores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [subject, setSubject] = useState('');
    const [password, setPassword] = useState('');
    const [showSubjectPicker, setShowSubjectPicker] = useState(false);

    const subjectOptions = Object.entries(subjectNamesPt).map(([key, label]) => ({ key, label }));

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        setLoading(true);
        try {
            const data = await teacherManagerService.list();
            const list = Array.isArray(data) ? data : (data.content || []);
            setProfessores(list);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const generatePassword = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
        let pwd = '';
        for (let i = 0; i < 10; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pwd;
    };

    const copyToClipboard = (text) => {
        Clipboard.setString(text);
        Alert.alert('Copiado!', 'Senha copiada para a área de transferência.');
    };

    const openNew = () => {
        setEditingId(null);
        setName(''); setEmail(''); setCpf(''); setSubject('');
        setPassword(generatePassword());
        setShowSubjectPicker(false);
        setShowForm(true);
    };

    const openEdit = (row) => {
        setEditingId(row.id);
        setName(row.name);
        setEmail(row.email);
        setCpf(row.cpf || '');
        setSubject(row.subjects?.[0] || row.subject || '');
        setPassword('');
        setShowSubjectPicker(false);
        setShowForm(true);
    };

    const save = async () => {
        if (!name.trim() || !email.trim()) {
            Alert.alert('Campos obrigatórios', 'Preencha pelo menos o nome e o email.');
            return;
        }
        const payload = { name, email, cpf, subject, password };
        try {
            if (editingId) {
                await teacherManagerService.update(editingId, payload);
            } else {
                await teacherManagerService.create(payload);
                Alert.alert(
                    'Professor criado!',
                    `Dados de acesso:\n\nEmail: ${email}\nSenha: ${password}\n\nAnote ou copie a senha antes de fechar.`,
                    [{ text: 'OK' }]
                );
            }
            setShowForm(false);
            load();
        } catch (e) {
            Alert.alert("Erro", "Falha ao salvar professor");
        }
    };

    const confirmDelete = async (id) => {
        Alert.alert("Confirmar", "Deletar professor?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Deletar",
                style: "destructive",
                onPress: async () => {
                    await teacherManagerService.softDelete(id);
                    load();
                }
            }
        ]);
    };

    if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#3970B7" /></View>;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <TouchableOpacity onPress={openNew} style={styles.addButton}>
                <UserPlus color="white" size={20} style={styles.addIcon} />
                <Text style={styles.addButtonText}>Adicionar Professor</Text>
            </TouchableOpacity>

            <View style={styles.listContainer}>
                {professores.map(p => (
                    <View key={p.id} style={styles.teacherCard}>
                        <View style={{ flex: 1, marginRight: 12 }}>
                            <Text style={styles.teacherName}>{p.name}</Text>
                            <Text style={styles.teacherEmail}>{p.email}</Text>
                            <Text style={styles.teacherSubject}>
                                {(p.subjects || []).map(s => translateSubject(s)).join(', ') || translateSubject(p.subject)}
                            </Text>
                            <Text style={styles.teacherRate}>R$ {Number(p.hourlyRate || 0).toFixed(2)}/h</Text>
                        </View>
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity onPress={() => openEdit(p)}>
                                <Edit2 size={20} color="#3970B7" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => confirmDelete(p.id)}>
                                <Trash2 size={20} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>

            <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? "Editar Professor" : "Novo Professor"}>
                <View style={styles.formContainer}>
                    <Input label="Nome" value={name} onChangeText={setName} placeholder="Nome completo" />
                    <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" placeholder="email@exemplo.com" keyboardType="email-address" />
                    <Input label="CPF" value={cpf} onChangeText={setCpf} placeholder="000.000.000-00" keyboardType="numeric" />

                    {/* Dropdown de disciplina */}
                    <View style={styles.dropdownSection}>
                        <Text style={styles.dropdownLabel}>Disciplina</Text>
                        <TouchableOpacity
                            style={styles.dropdownTrigger}
                            onPress={() => setShowSubjectPicker(!showSubjectPicker)}
                            activeOpacity={0.7}
                        >
                            <Text style={subject ? styles.dropdownValueText : styles.dropdownPlaceholder}>
                                {subject ? translateSubject(subject) : 'Selecione uma disciplina'}
                            </Text>
                            <ChevronDown size={18} color="#6B7280" />
                        </TouchableOpacity>
                        {showSubjectPicker && (
                            <View style={styles.dropdownList}>
                                {subjectOptions.map(opt => (
                                    <TouchableOpacity
                                        key={opt.key}
                                        style={[
                                            styles.dropdownItem,
                                            subject === opt.key && styles.dropdownItemActive,
                                        ]}
                                        onPress={() => { setSubject(opt.key); setShowSubjectPicker(false); }}
                                    >
                                        <Text style={[
                                            styles.dropdownItemText,
                                            subject === opt.key && styles.dropdownItemTextActive,
                                        ]}>{opt.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Senha — só aparece ao criar */}
                    {!editingId && (
                        <View style={styles.passwordSection}>
                            <Text style={styles.passwordLabel}>Senha gerada</Text>
                            <View style={styles.passwordRow}>
                                <View style={styles.passwordBox}>
                                    <Text style={styles.passwordText} selectable>{password}</Text>
                                </View>
                                <TouchableOpacity style={styles.passwordIconBtn} onPress={() => copyToClipboard(password)}>
                                    <Copy size={18} color="#3970B7" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.passwordIconBtn} onPress={() => setPassword(generatePassword())}>
                                    <RefreshCw size={18} color="#3970B7" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.passwordHint}>Essa senha será usada no primeiro login do professor.</Text>
                        </View>
                    )}

                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowForm(false)}>
                            <Text style={styles.cancelBtnText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveBtn} onPress={save}>
                            <Text style={styles.saveBtnText}>{editingId ? 'Salvar' : 'Criar Professor'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: '#3970B7',
        padding: 14,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    addIcon: {
        marginRight: 8,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    listContainer: {
        marginBottom: 32,
    },
    teacherCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    teacherName: {
        fontWeight: '700',
        color: '#1F2937',
        fontSize: 15,
    },
    teacherEmail: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    teacherSubject: {
        fontSize: 13,
        color: '#3970B7',
        marginTop: 4,
        fontWeight: '600',
    },
    teacherRate: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    formContainer: {
        paddingTop: 8,
    },
    dropdownSection: {
        marginBottom: 16,
    },
    dropdownLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 13,
        backgroundColor: '#FFFFFF',
    },
    dropdownValueText: {
        fontSize: 15,
        color: '#1F2937',
    },
    dropdownPlaceholder: {
        fontSize: 15,
        color: '#9CA3AF',
    },
    dropdownList: {
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        maxHeight: 200,
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingHorizontal: 14,
        paddingVertical: 11,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    dropdownItemActive: {
        backgroundColor: '#EBF0F7',
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#374151',
    },
    dropdownItemTextActive: {
        color: '#3970B7',
        fontWeight: '700',
    },
    passwordSection: {
        marginBottom: 16,
    },
    passwordLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    passwordBox: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    passwordText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        fontFamily: 'monospace',
        letterSpacing: 1,
    },
    passwordIconBtn: {
        backgroundColor: '#EEF2FF',
        padding: 10,
        borderRadius: 8,
    },
    passwordHint: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 6,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 8,
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#6B7280',
        fontWeight: '600',
        fontSize: 15,
    },
    saveBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: '#3970B7',
        alignItems: 'center',
    },
    saveBtnText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15,
    },
});
