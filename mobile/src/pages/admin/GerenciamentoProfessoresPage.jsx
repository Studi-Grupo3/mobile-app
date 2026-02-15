import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, ActivityIndicator, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { mockTeacherManagerService as teacherManagerService } from '../../mocks/mockServices';
import { translateSubject } from '../../utils/tradutionUtils';
import { UserPlus, Edit2, Trash2 } from 'lucide-react-native';

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

    const generatePassword = () => Math.random().toString(36).slice(-8);

    const openNew = () => {
        setEditingId(null);
        setName(''); setEmail(''); setCpf(''); setSubject('');
        setPassword(generatePassword());
        setShowForm(true);
    };

    const openEdit = (row) => {
        setEditingId(row.id);
        setName(row.name);
        setEmail(row.email);
        setCpf(row.cpf || '');
        setSubject(row.subjects?.[0] || row.subject || '');
        setPassword('');
        setShowForm(true);
    };

    const save = async () => {
        const payload = { name, email, cpf, subject, password };
        try {
            if (editingId) {
                await teacherManagerService.update(editingId, payload);
            } else {
                await teacherManagerService.create(payload);
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
        <ScrollView style={styles.container}>
            <Text style={styles.pageTitle}>Gerenciar Professores</Text>

            <TouchableOpacity onPress={openNew} style={styles.addButton}>
                <UserPlus color="white" size={20} style={styles.addIcon} />
                <Text style={styles.addButtonText}>Adicionar Professor</Text>
            </TouchableOpacity>

            <View style={styles.listContainer}>
                {professores.map(p => (
                    <View key={p.id} style={styles.teacherCard}>
                        <View>
                            <Text style={styles.teacherName}>{p.name}</Text>
                            <Text style={styles.teacherSubject}>{translateSubject(p.subjects?.[0] || p.subject)}</Text>
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

            <Modal visible={showForm} onClose={() => setShowForm(false)} title={editingId ? "Editar" : "Novo Professor"}>
                <View style={styles.formContainer}>
                    <Input label="Nome" value={name} onChangeText={setName} />
                    <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
                    <Input label="CPF" value={cpf} onChangeText={setCpf} />
                    <Input label="Disciplina (Sigla)" value={subject} onChangeText={setSubject} />

                    <View style={styles.saveButtonContainer}>
                        <Button title="Salvar" onPress={save} />
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // gray-100
        padding: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageTitle: {
        fontSize: 24, // text-2xl
        fontWeight: 'bold',
        color: '#1F2937', // gray-800
        marginBottom: 24,
    },
    addButton: {
        backgroundColor: '#3970B7',
        padding: 12,
        borderRadius: 8,
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
        borderRadius: 8,
        marginBottom: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    teacherName: {
        fontWeight: 'bold',
        color: '#1F2937', // gray-800
    },
    teacherSubject: {
        fontSize: 14, // text-sm
        color: '#6B7280', // gray-500
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    formContainer: {
        paddingVertical: 16,
        gap: 12,
    },
    saveButtonContainer: {
        marginTop: 16,
    },
});
