import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

/* 
INSTRUÇÕES PARA CONFIGURAÇÃO DO FIREBASE:
1. Acesse o Firebase Console (https://console.firebase.google.com/)
2. Crie um novo projeto "EcoHidrico"
3. Adicione um app Web e copie o objeto firebaseConfig gerado
4. Substitua o objeto 'firebaseConfig' abaixo pelos seus dados reais
5. No painel do Firebase, vá em "Firestore Database" e crie um banco de dados
6. Em "Regras" (Rules) do Firestore, altere para "allow read, write: if true;" para testes iniciais (ATENÇÃO: para produção, configure regras de segurança adequadas).
*/

const firebaseConfig = {
    // COLOQUE SUAS CREDENCIAIS AQUI
    apiKey: "SUA_API_KEY",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializa o Firebase
let db = null;
try {
    // Evitar erro se a configuração for a de teste
    if(firebaseConfig.apiKey !== "SUA_API_KEY") {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
    }
} catch (e) {
    console.warn("Firebase não inicializado. Verifique o firebaseConfig.");
}

document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    // Toggle Mobile Menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    // Handle Tab Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('data-target');

            // Remove active class from all links and contents
            navLinks.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(content => {
                content.classList.remove('active');
                // Force reflow to restart animation
                void content.offsetWidth;
            });

            // Add active class to clicked link and corresponding content
            link.classList.add('active');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }

            // Close mobile menu if it's open
            if (navMenu.classList.contains('open')) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('open');
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.style.background = 'rgba(11, 29, 46, 0.9)';
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(11, 29, 46, 0.7)';
            header.style.boxShadow = 'none';
        }
    });
    // Render Bar Chart (Lixo Coletado)
    const renderChart = () => {
        const chartContainer = document.getElementById('bar-chart');
        if (!chartContainer) return;

        // Clear existing to avoid duplicates if called multiple times
        chartContainer.innerHTML = '';

        const mockData = [
            { month: 'Out', value: 120 },
            { month: 'Nov', value: 150 },
            { month: 'Dez', value: 180 },
            { month: 'Jan', value: 210 },
            { month: 'Fev', value: 270 },
            { month: 'Mar', value: 310 }
        ];

        const maxValue = Math.max(...mockData.map(d => d.value));

        mockData.forEach((data, index) => {
            const heightPercent = (data.value / maxValue) * 100;
            
            const group = document.createElement('div');
            group.className = 'chart-bar-group';

            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            // Start at 0 height for animation
            bar.style.height = '0%';
            
            // Add a small delay based on index for a cascade animation effect
            setTimeout(() => {
                bar.style.height = `${heightPercent}%`;
            }, 100 * index);

            const label = document.createElement('div');
            label.className = 'chart-label';
            label.innerText = data.month;

            const valueLabel = document.createElement('div');
            valueLabel.className = 'chart-value';
            valueLabel.innerText = `${data.value}kg`;

            group.appendChild(valueLabel);
            group.appendChild(bar);
            group.appendChild(label);
            
            chartContainer.appendChild(group);
        });
    };

    // Call renderChart initially
    renderChart();

    // Re-trigger animation when clicking on 'lixo-coletado' tab
    const lixoTabBtn = document.querySelector('[data-target="lixo-coletado"]');
    if (lixoTabBtn) {
        lixoTabBtn.addEventListener('click', () => {
            setTimeout(renderChart, 100);
        });
    }

    // Formulário de Denúncias (Integração com Firebase)
    const reportForm = document.getElementById('report-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');
    const newReportBtn = document.getElementById('new-report-btn');

    if (reportForm) {
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Adiciona classe de loading no botão
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Coleta os dados do formulário
            const formData = new FormData(reportForm);
            
            // Tratamento especial para o serverTimestamp (usar date local no mock se db não existir)
            let dataRegistroVal = null;
            try {
                dataRegistroVal = db ? serverTimestamp() : new Date().toISOString();
            } catch(e) {
                dataRegistroVal = new Date().toISOString();
            }

            const reportData = {
                tipoOcorrencia: formData.get('tipo-ocorrencia'),
                localizacao: formData.get('localizacao'),
                descricao: formData.get('descricao'),
                urgencia: formData.get('urgencia'),
                nome: formData.get('nome') || 'Anônimo',
                contato: formData.get('contato') || 'Não informado',
                dataRegistro: dataRegistroVal
            };

            try {
                if (db) {
                    // Salva no Firestore real
                    await addDoc(collection(db, "denuncias"), reportData);
                } else {
                    // Simula salvamento (quando as chaves reais ainda não foram configuradas)
                    console.log("Mock de salvamento de denúncia recebido:", reportData);
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }

                // Oculta o formulário e mostra a mensagem de sucesso
                reportForm.style.display = 'none';
                successMessage.classList.remove('hidden');

            } catch (error) {
                console.error("Erro ao salvar denúncia: ", error);
                alert("Ocorreu um erro ao enviar sua denúncia. Tente novamente mais tarde.");
            } finally {
                // Remove estado de loading
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    if (newReportBtn) {
        newReportBtn.addEventListener('click', () => {
            reportForm.reset();
            successMessage.classList.add('hidden');
            reportForm.style.display = 'flex';
        });
    }
});
