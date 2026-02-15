import React, { useRef, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView, StyleSheet,
    Dimensions, Animated, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    GraduationCap, BookOpen, Users, Calendar, Clock, Shield,
    Star, ChevronRight, ArrowRight, Sparkles, Monitor, MapPin,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const FeatureCard = ({ icon: Icon, title, description, delay, color }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 600,
                delay,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: 0,
                friction: 8,
                tension: 40,
                delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[styles.featureCard, { opacity, transform: [{ translateY }] }]}>
            <View style={[styles.featureIconContainer, { backgroundColor: color + '18' }]}>
                <Icon size={24} color={color} />
            </View>
            <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureDescription}>{description}</Text>
            </View>
            <ChevronRight size={18} color="#CBD5E1" />
        </Animated.View>
    );
};

const PlanCard = ({ level, subtitle, features, color, bgColor, delay }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, friction: 6, tension: 40, delay, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[styles.planCard, { backgroundColor: bgColor, opacity, transform: [{ scale }] }]}>
            <View style={[styles.planBadge, { backgroundColor: color }]}>
                <GraduationCap size={16} color="#FFF" />
            </View>
            <Text style={[styles.planLevel, { color }]}>{level}</Text>
            <Text style={styles.planSubtitle}>{subtitle}</Text>
            <View style={styles.planFeatures}>
                {features.map((f, i) => (
                    <View key={i} style={styles.planFeatureRow}>
                        <Star size={12} color={color} />
                        <Text style={styles.planFeatureText}>{f}</Text>
                    </View>
                ))}
            </View>
        </Animated.View>
    );
};

const StatItem = ({ value, label }) => (
    <View style={styles.statItem}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

export default function WelcomePage() {
    const navigation = useNavigation();
    const heroOpacity = useRef(new Animated.Value(0)).current;
    const heroTranslate = useRef(new Animated.Value(40)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(heroOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.spring(heroTranslate, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#3970B7" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.miniLogo}>
                        <GraduationCap size={20} color="#3970B7" />
                    </View>
                    <Text style={styles.headerBrand}>STUDI</Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={styles.headerLoginBtn}
                >
                    <Text style={styles.headerLoginText}>Entrar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero */}
                <Animated.View style={[styles.heroSection, { opacity: heroOpacity, transform: [{ translateY: heroTranslate }] }]}>
                    <View style={styles.heroDecor1} />
                    <View style={styles.heroDecor2} />

                    <View style={styles.heroBadge}>
                        <Sparkles size={14} color="#FECB0A" />
                        <Text style={styles.heroBadgeText}>Plataforma #1 de aulas particulares</Text>
                    </View>

                    <Text style={styles.heroTitle}>
                        Seu caminho para o{'\n'}
                        <Text style={styles.heroTitleHighlight}>sucesso</Text> começa aqui
                    </Text>

                    <Text style={styles.heroSubtitle}>
                        Conectamos alunos a professores qualificados para aulas personalizadas que transformam resultados.
                    </Text>

                    <View style={styles.heroButtons}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Register')}
                            style={styles.primaryButton}
                        >
                            <Text style={styles.primaryButtonText}>Começar Agora</Text>
                            <ArrowRight size={18} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                            style={styles.secondaryButton}
                        >
                            <Text style={styles.secondaryButtonText}>Já tenho conta</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <StatItem value="500+" label="Alunos" />
                        <View style={styles.statDivider} />
                        <StatItem value="50+" label="Professores" />
                        <View style={styles.statDivider} />
                        <StatItem value="4.9" label="Avaliação" />
                    </View>
                </Animated.View>

                {/* Features Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>POR QUE ESCOLHER</Text>
                    <Text style={styles.sectionTitle}>Nossos Diferenciais</Text>

                    <FeatureCard
                        icon={Users}
                        title="Professores Qualificados"
                        description="Seleção cuidadosa dos melhores professores"
                        delay={0}
                        color="#3970B7"
                    />
                    <FeatureCard
                        icon={Clock}
                        title="Flexibilidade de Horários"
                        description="Aulas nos melhores dias e horários para você"
                        delay={100}
                        color="#10B981"
                    />
                    <FeatureCard
                        icon={Shield}
                        title="Seguro e Transparente"
                        description="Pagamentos protegidos e acompanhamento total"
                        delay={200}
                        color="#8B5CF6"
                    />
                    <FeatureCard
                        icon={Monitor}
                        title="Online ou Presencial"
                        description="Escolha como e onde quer aprender"
                        delay={300}
                        color="#F59E0B"
                    />
                    <FeatureCard
                        icon={MapPin}
                        title="Perto de Você"
                        description="Professores na sua região, facilitando o presencial"
                        delay={400}
                        color="#EF4444"
                    />
                </View>

                {/* Plans Section */}
                <View style={[styles.section, styles.plansSection]}>
                    <Text style={styles.sectionLabel}>PARA TODOS OS NÍVEIS</Text>
                    <Text style={[styles.sectionTitle, { color: '#FFF' }]}>Conheça Nossos Planos</Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.plansScroll}
                    >
                        <PlanCard
                            level="Ensino Infantil"
                            subtitle="Aprendizado lúdico"
                            features={['Atividades interativas', 'Professores especializados', 'Aulas dinâmicas']}
                            color="#F59E0B"
                            bgColor="#FFFBEB"
                            delay={0}
                        />
                        <PlanCard
                            level="Ensino Fundamental"
                            subtitle="Base sólida"
                            features={['Reforço escolar', 'Todas as matérias', 'Preparação para provas']}
                            color="#3970B7"
                            bgColor="#EFF6FF"
                            delay={150}
                        />
                        <PlanCard
                            level="Ensino Médio"
                            subtitle="Rumo ao vestibular"
                            features={['Preparatório ENEM', 'Redação impecável', 'Exercícios avançados']}
                            color="#8B5CF6"
                            bgColor="#F5F3FF"
                            delay={300}
                        />
                    </ScrollView>
                </View>

                {/* Social proof */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>DEPOIMENTOS</Text>
                    <Text style={styles.sectionTitle}>O que dizem sobre nós</Text>

                    <View style={styles.testimonialCard}>
                        <View style={styles.testimonialStars}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} size={16} color="#FECB0A" fill="#FECB0A" />
                            ))}
                        </View>
                        <Text style={styles.testimonialText}>
                            "A Studi transformou a forma como meu filho estuda. Em poucos meses, as notas melhoraram muito!"
                        </Text>
                        <Text style={styles.testimonialAuthor}>- Patrícia M., Mãe de aluno</Text>
                    </View>

                    <View style={styles.testimonialCard}>
                        <View style={styles.testimonialStars}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} size={16} color="#FECB0A" fill="#FECB0A" />
                            ))}
                        </View>
                        <Text style={styles.testimonialText}>
                            "Como professor, a plataforma me dá autonomia e alunos engajados. Super recomendo!"
                        </Text>
                        <Text style={styles.testimonialAuthor}>- Carlos O., Professor</Text>
                    </View>
                </View>

                {/* CTA Section */}
                <View style={styles.ctaSection}>
                    <View style={styles.ctaDecor} />
                    <Text style={styles.ctaTitle}>Pronto para começar?</Text>
                    <Text style={styles.ctaSubtitle}>
                        Cadastre-se gratuitamente e encontre o professor ideal para você.
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Register')}
                        style={styles.ctaButton}
                    >
                        <Text style={styles.ctaButtonText}>Criar Minha Conta</Text>
                        <ArrowRight size={18} color="#3970B7" />
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.footerLogo}>
                        <GraduationCap size={20} color="#FECB0A" />
                        <Text style={styles.footerBrand}>STUDI</Text>
                    </View>
                    <Text style={styles.footerText}>Aulas Particulares</Text>
                    <View style={styles.footerDivider} />
                    <Text style={styles.footerContact}>(11) 98345-8739</Text>
                    <Text style={styles.footerEmail}>contato@studi.com.br</Text>
                    <Text style={styles.footerCopyright}>© 2026 Studi. Todos os direitos reservados.</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 12,
        backgroundColor: '#3970B7',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    miniLogo: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FECB0A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBrand: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 3,
    },
    headerLoginBtn: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    headerLoginText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
    },
    scrollContent: {
        flexGrow: 1,
    },

    // Hero
    heroSection: {
        backgroundColor: '#3970B7',
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 40,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        overflow: 'hidden',
    },
    heroDecor1: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255,255,255,0.04)',
    },
    heroDecor2: {
        position: 'absolute',
        bottom: -20,
        left: -30,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(254,203,10,0.06)',
    },
    heroBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(254,203,10,0.15)',
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 20,
    },
    heroBadgeText: {
        color: '#FECB0A',
        fontSize: 12,
        fontWeight: '600',
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        lineHeight: 40,
        marginBottom: 16,
    },
    heroTitleHighlight: {
        color: '#FECB0A',
    },
    heroSubtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 22,
        marginBottom: 28,
    },
    heroButtons: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FECB0A',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#FECB0A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    primaryButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 15,
    },
    secondaryButton: {
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    secondaryButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 15,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FECB0A',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },

    // Sections
    section: {
        paddingHorizontal: 20,
        paddingVertical: 32,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FECB0A',
        letterSpacing: 2,
        marginBottom: 6,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 20,
    },

    // Feature Cards
    featureCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
    },
    featureIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 3,
    },
    featureDescription: {
        fontSize: 13,
        color: '#64748B',
    },

    // Plans
    plansSection: {
        backgroundColor: '#3970B7',
        marginHorizontal: 0,
        borderRadius: 0,
    },
    plansScroll: {
        paddingRight: 20,
        gap: 14,
    },
    planCard: {
        width: width * 0.65,
        borderRadius: 20,
        padding: 20,
        marginTop: 8,
    },
    planBadge: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    planLevel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    planSubtitle: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 14,
    },
    planFeatures: {
        gap: 8,
    },
    planFeatureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    planFeatureText: {
        fontSize: 13,
        color: '#475569',
    },

    // Testimonials
    testimonialCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 14,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    testimonialStars: {
        flexDirection: 'row',
        gap: 4,
        marginBottom: 12,
    },
    testimonialText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
        fontStyle: 'italic',
        marginBottom: 10,
    },
    testimonialAuthor: {
        fontSize: 13,
        color: '#94A3B8',
        fontWeight: '600',
    },

    // CTA
    ctaSection: {
        backgroundColor: '#1E3A5F',
        margin: 20,
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        overflow: 'hidden',
    },
    ctaDecor: {
        position: 'absolute',
        top: -30,
        right: -30,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(254,203,10,0.08)',
    },
    ctaTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 10,
    },
    ctaSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FECB0A',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 14,
    },
    ctaButtonText: {
        color: '#3970B7',
        fontWeight: 'bold',
        fontSize: 15,
    },

    // Footer
    footer: {
        backgroundColor: '#3970B7',
        padding: 32,
        alignItems: 'center',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    footerLogo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    footerBrand: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    footerText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        marginBottom: 16,
    },
    footerDivider: {
        width: 40,
        height: 1,
        backgroundColor: 'rgba(254,203,10,0.4)',
        marginBottom: 16,
    },
    footerContact: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        marginBottom: 4,
    },
    footerEmail: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        marginBottom: 16,
    },
    footerCopyright: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
    },
});
