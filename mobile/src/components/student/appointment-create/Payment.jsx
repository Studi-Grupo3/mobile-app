import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { BookOpen, Clock, Calendar, CreditCard, CheckCircle } from "lucide-react-native";
import { appointmentCreateService } from "../../../services/appointmentCreateService";
import { parseDurationToMinutes } from "../../../utils/date";
import Constants from 'expo-constants';

// ══════ MOCK MODE: reads from app.json extra.PAYMENT_MOCK ══════
const PAYMENT_MOCK = Constants.expoConfig?.extra?.PAYMENT_MOCK === 'true' || Constants.expoConfig?.extra?.PAYMENT_MOCK === true;
// ═════════════════════════════════════════════════════════════

export default function Payment({ data, onUpdate, onNext, navigation }) {
    const [step, setStep] = useState("endereco");
    const [paymentMethod, setPaymentMethod] = useState(data.pagamento.method || "credito");
    const [cep, setCep] = useState(data.endereco.cep || "");
    const [endereco, setEndereco] = useState({ ...data.endereco });
    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState(data.pagamento.cupom || "");
    const [errorMsg, setErrorMsg] = useState("");

    const lessonDurationLocal = parseDurationToMinutes(data.duration || "");
    const totalValueLocal = lessonDurationLocal * 1;

    const handleCepChange = async (text) => {
        const onlyDigits = text.replace(/\D/g, "");
        setCep(onlyDigits);
        if (onlyDigits.length === 8) {
            try {
                const resp = await fetch(`https://viacep.com.br/ws/${onlyDigits}/json/`);
                const json = await resp.json();
                if (!json.erro) {
                    const newAddr = {
                        ...endereco,
                        rua: json.logradouro,
                        bairro: json.bairro,
                        cidade: json.localidade,
                        estado: json.uf,
                        cep: onlyDigits
                    };
                    setEndereco(newAddr);
                    onUpdate({ endereco: newAddr });
                } else {
                    Alert.alert("Erro", "CEP não encontrado.");
                }
            } catch {
                Alert.alert("Erro", "Erro ao buscar CEP.");
            }
        } else {
            onUpdate({ endereco: { ...endereco, cep: onlyDigits } });
        }
    };

    const updateAddrField = (field, val) => {
        const newAddr = { ...endereco, [field]: val };
        setEndereco(newAddr);
        onUpdate({ endereco: newAddr });
    };

    const handleFieldChange = (field, value) => {
        onUpdate({
            pagamento: { ...data.pagamento, [field]: value },
        });
    };

    const handleApplyCoupon = () => {
        if (couponCode) {
            onUpdate({ pagamento: { ...data.pagamento, cupom: couponCode, descontoAplicado: true, desconto: 0 } });
            Alert.alert("Cupom", "Cupom aplicado (Simulação)");
        }
    };

    const handleFinalize = async () => {
        setErrorMsg("");
        setLoading(true);
        try {
            const lessonDuration = parseDurationToMinutes(data.duration || "");
            const ratePerMinute = 1;
            const totalValue = lessonDuration * ratePerMinute;

            // Always create the appointment via backend
            await appointmentCreateService.create({
                ...data,
                pagamento: {
                    ...data.pagamento,
                    lessonDuration,
                    totalValue,
                    method: paymentMethod,
                },
            });

            Alert.alert(
                "✅ Agendamento Realizado!",
                `Aula de ${data.subject || 'matéria'} agendada com sucesso!\n\nData: ${data.date ? new Date(data.date).toLocaleDateString('pt-BR') : '—'}\nHorário: ${data.time || '—'}\nValor: R$ ${totalValue.toFixed(2).replace(".", ",")}${PAYMENT_MOCK ? '\n\n(Modo demonstração - pagamento simulado)' : ''}`,
                [{ text: "OK" }]
            );
        } catch (err) {
            console.error(err);
            setErrorMsg("Erro ao agendar. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const Summary = () => (
        <View style={styles.summaryContainer}>
            <View style={styles.summaryHeader}>
                <CreditCard size={20} color="#3970B7" />
                <Text style={styles.summaryTitle}>Resumo</Text>
            </View>

            <View style={styles.summaryDetails}>
                <View style={styles.detailRow}>
                    <BookOpen size={16} color="#3970B7" />
                    <Text style={styles.detailText}>{data.subject || "—"}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Clock size={16} color="#3970B7" />
                    <Text style={styles.detailText}>{data.duration || "—"}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Calendar size={16} color="#3970B7" />
                    <Text style={styles.detailText}>{data.date ? new Date(data.date).toLocaleDateString() : "—"}</Text>
                </View>
            </View>

            <View style={styles.couponSection}>
                <Text style={styles.couponLabel}>Cupom de desconto</Text>
                <View style={styles.couponInputContainer}>
                    <TextInput
                        style={styles.couponInput}
                        placeholder="Código"
                        placeholderTextColor="#9ca3af"
                        value={couponCode}
                        onChangeText={(t) => { setCouponCode(t); handleFieldChange("cupom", t); }}
                    />
                    <TouchableOpacity onPress={handleApplyCoupon} style={styles.applyButton}>
                        <Text style={styles.applyButtonText}>Aplicar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.totalsSection}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Subtotal</Text>
                    <Text style={styles.totalValue}>R$ {totalValueLocal.toFixed(2).replace(".", ",")}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Desconto</Text>
                    <Text style={styles.discountValue}>- R$ {(data.pagamento.desconto || 0).toFixed(2).replace(".", ",")}</Text>
                </View>
                <View style={styles.finalTotalRow}>
                    <Text style={styles.finalTotalLabel}>TOTAL</Text>
                    <Text style={styles.finalTotalValue}>
                        R$ {(totalValueLocal - (data.pagamento.desconto || 0)).toFixed(2).replace(".", ",")}
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.stepTabs}>
                {["endereco", "pagamento"].map(s => (
                    <TouchableOpacity
                        key={s}
                        onPress={() => setStep(s)}
                        style={[
                            styles.tabButton,
                            step === s && styles.activeTab
                        ]}
                    >
                        <Text style={[
                            styles.tabText,
                            step === s ? styles.activeTabText : styles.inactiveTabText
                        ]}>
                            {s === "endereco" ? "Endereço" : "Pagamento"}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {step === "endereco" && (
                <View style={styles.formContainer}>
                    <View style={styles.field}>
                        <Text style={styles.label}>CEP</Text>
                        <TextInput
                            style={styles.input}
                            value={cep}
                            onChangeText={handleCepChange}
                            keyboardType="numeric"
                            maxLength={9}
                            placeholderTextColor="#9ca3af"
                        />
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.label}>Rua</Text>
                        <TextInput
                            style={styles.input}
                            value={endereco.rua || ""}
                            onChangeText={t => updateAddrField("rua", t)}
                            placeholderTextColor="#9ca3af"
                        />
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.field, styles.flex1]}>
                            <Text style={styles.label}>Número</Text>
                            <TextInput
                                style={styles.input}
                                value={endereco.numero || ""}
                                onChangeText={t => updateAddrField("numero", t)}
                                placeholderTextColor="#9ca3af"
                            />
                        </View>
                        <View style={[styles.field, styles.flex1]}>
                            <Text style={styles.label}>Complemento</Text>
                            <TextInput
                                style={styles.input}
                                value={endereco.complemento || ""}
                                onChangeText={t => updateAddrField("complemento", t)}
                                placeholderTextColor="#9ca3af"
                            />
                        </View>
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.label}>Bairro</Text>
                        <TextInput
                            style={styles.input}
                            value={endereco.bairro || ""}
                            onChangeText={t => updateAddrField("bairro", t)}
                            placeholderTextColor="#9ca3af"
                        />
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.field, styles.flex1]}>
                            <Text style={styles.label}>Cidade</Text>
                            <TextInput
                                style={styles.input}
                                value={endereco.cidade || ""}
                                onChangeText={t => updateAddrField("cidade", t)}
                                placeholderTextColor="#9ca3af"
                            />
                        </View>
                        <View style={[styles.field, styles.flex1]}>
                            <Text style={styles.label}>Estado</Text>
                            <TextInput
                                style={styles.input}
                                value={endereco.estado || ""}
                                onChangeText={t => updateAddrField("estado", t)}
                                placeholderTextColor="#9ca3af"
                            />
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => setStep("pagamento")} style={styles.continueButton}>
                        <Text style={styles.continueButtonText}>Continuar para Pagamento</Text>
                    </TouchableOpacity>
                </View>
            )}

            {step === "pagamento" && (
                <View>
                    <Summary />

                    <View style={styles.paymentForm}>
                        <Text style={styles.sectionHeading}>Dados do Cartão</Text>
                        <View style={styles.paymentMethods}>
                            {["credito", "debito"].map(m => (
                                <TouchableOpacity
                                    key={m}
                                    onPress={() => { setPaymentMethod(m); handleFieldChange("method", m); }}
                                    style={[
                                        styles.methodButton,
                                        paymentMethod === m ? styles.activeMethod : styles.inactiveMethod
                                    ]}
                                >
                                    <Text style={[
                                        styles.methodText,
                                        paymentMethod === m ? styles.activeMethodText : styles.inactiveMethodText
                                    ]}>
                                        {m === "credito" ? "Crédito" : "Débito"}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.formContainer}>
                            <View style={styles.field}>
                                <Text style={styles.label}>Número do Cartão</Text>
                                <TextInput
                                    style={styles.input}
                                    value={data.pagamento.numero || ""}
                                    onChangeText={t => handleFieldChange("numero", t)}
                                    keyboardType="numeric"
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>
                            <View style={styles.row}>
                                <View style={[styles.field, styles.flex1]}>
                                    <Text style={styles.label}>Validade</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={data.pagamento.validade || ""}
                                        onChangeText={t => handleFieldChange("validade", t)}
                                        placeholder="MM/AA"
                                        placeholderTextColor="#9ca3af"
                                    />
                                </View>
                                <View style={[styles.field, styles.flex1]}>
                                    <Text style={styles.label}>CVV</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={data.pagamento.cvv || ""}
                                        onChangeText={t => handleFieldChange("cvv", t)}
                                        keyboardType="numeric"
                                        placeholderTextColor="#9ca3af"
                                    />
                                </View>
                            </View>
                            <View style={styles.field}>
                                <Text style={styles.label}>Nome no Cartão</Text>
                                <TextInput
                                    style={styles.input}
                                    value={data.pagamento.nomeCartao || ""}
                                    onChangeText={t => handleFieldChange("nomeCartao", t)}
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>
                        </View>

                        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

                        <TouchableOpacity
                            onPress={handleFinalize}
                            disabled={loading}
                            style={styles.finalizeButton}
                        >
                            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.finalizeButtonText}>Confirmar e Agendar</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    stepTabs: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#F3F4F6', // gray-100
        padding: 4,
        borderRadius: 8,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeTab: {
        backgroundColor: 'white',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
    },
    activeTabText: {
        color: '#3970B7',
    },
    inactiveTabText: {
        color: '#6B7280', // gray-500
    },
    formContainer: {
        gap: 16,
        marginBottom: 24,
    },
    field: {
        marginBottom: 0,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    flex1: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        color: '#4B5563', // gray-600
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB', // gray-300
        borderRadius: 4,
        padding: 12,
        backgroundColor: 'white',
        fontSize: 16,
        color: '#000',
    },
    continueButton: {
        backgroundColor: '#3970B7',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    continueButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    summaryContainer: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#FACC15', // yellow-400
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3970B7',
    },
    summaryDetails: {
        gap: 8,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#374151', // gray-700
    },
    couponSection: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB', // gray-200
        paddingTop: 8,
        marginBottom: 16,
    },
    couponLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        color: '#374151',
    },
    couponInputContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    couponInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 4,
        padding: 8,
        fontSize: 14,
        backgroundColor: '#F9FAFB', // gray-50
        color: '#000',
    },
    applyButton: {
        backgroundColor: '#3970B7',
        paddingHorizontal: 12,
        justifyContent: 'center',
        borderRadius: 4,
    },
    applyButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    totalsSection: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 8,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    totalLabel: {
        fontSize: 14,
        color: '#374151',
    },
    totalValue: {
        fontSize: 14,
        color: '#374151',
    },
    discountValue: {
        fontSize: 14,
        color: '#16A34A', // green-600
    },
    finalTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 8,
    },
    finalTotalLabel: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#1F2937',
    },
    finalTotalValue: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#3970B7',
    },
    paymentForm: {
        marginBottom: 24,
    },
    sectionHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1F2937',
    },
    paymentMethods: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    methodButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 4,
    },
    activeMethod: {
        borderColor: '#3970B7',
        backgroundColor: '#EFF6FF', // blue-50
    },
    inactiveMethod: {
        borderColor: '#D1D5DB', // gray-300
    },
    methodText: {
        fontSize: 14,
    },
    activeMethodText: {
        color: '#3970B7',
        fontWeight: 'bold',
    },
    inactiveMethodText: {
        color: '#6B7280',
    },
    errorText: {
        color: '#EF4444', // red-500
        marginTop: 8,
    },
    finalizeButton: {
        backgroundColor: '#3970B7',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
    },
    finalizeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
