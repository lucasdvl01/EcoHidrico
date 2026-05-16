import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

/* INSTRUÇÕES DO FIREBASE OMITIDAS AQUI PARA BREVIDADE (Estão no arquivo original) */
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};

let db = null;
try {
    if(firebaseConfig.apiKey !== "SUA_API_KEY") {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
    }
} catch (e) {
    console.warn("Firebase não inicializado.");
}

export function initForm() {
    const reportForm = document.getElementById('report-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');
    const newReportBtn = document.getElementById('new-report-btn');
    const contatoInput = document.getElementById('contato');

    if (!reportForm) return;

    reportForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // VALIDAÇÃO UX: Checar se e-mail tem formato válido (caso preenchido)
        if (contatoInput && contatoInput.value.trim() !== '') {
            const contato = contatoInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // Se tem '@', assumimos que é tentativa de e-mail
            if (contato.includes('@') && !emailRegex.test(contato)) {
                alert('Por favor, insira um endereço de e-mail válido.');
                contatoInput.focus();
                return;
            }
        }

        submitBtn.classList.add('loading');
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.disabled = true;

        const formData = new FormData(reportForm);
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
                await addDoc(collection(db, "denuncias"), reportData);
            } else {
                console.log("Mock de salvamento de denúncia:", reportData);
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            reportForm.style.display = 'none';
            successMessage.classList.remove('hidden');

            // Acessibilidade: Envia o foco para a mensagem de sucesso
            successMessage.setAttribute('tabindex', '-1');
            successMessage.focus();

        } catch (error) {
            console.error("Erro ao salvar denúncia: ", error);
            alert("Ocorreu um erro ao enviar sua denúncia. Tente novamente mais tarde.");
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.setAttribute('aria-busy', 'false');
            submitBtn.disabled = false;
        }
    });

    if (newReportBtn) {
        newReportBtn.addEventListener('click', () => {
            reportForm.reset();
            successMessage.classList.add('hidden');
            reportForm.style.display = 'flex';
        });
    }
}
