// Elementos DOM
const paymentModal = document.getElementById('paymentModal');
const successModal = document.getElementById('successModal');
const closePaymentModal = document.getElementById('closePaymentModal');
const confirmRentalBtn = document.getElementById('confirmRental');
const submitPaymentBtn = document.getElementById('submitPayment');
const trackOrderBtn = document.getElementById('trackOrder');
const paymentModalForm = document.getElementById('paymentModalForm');
const deliverySection = document.getElementById('deliverySection');

// Timeline elements
const timelinePayment = document.getElementById('timelinePayment');
const timelinePreparation = document.getElementById('timelinePreparation');
const timelineShipping = document.getElementById('timelineShipping');

// Formatar número do cartão
function formatCardNumber(input) {
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formatted = value.replace(/(\d{4})/g, '$1 ').trim();
    input.value = formatted;
}

// Formatar data de validade
function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

// Somente números no CVV
function formatCvv(input) {
    input.value = input.value.replace(/\D/g, '');
}

// Configurar formatação dos campos
document.getElementById('modalCardNumber').addEventListener('input', function() {
    formatCardNumber(this);
});

document.getElementById('modalExpiryDate').addEventListener('input', function() {
    formatExpiryDate(this);
});

document.getElementById('modalCvv').addEventListener('input', function() {
    formatCvv(this);
});

// Abrir modal de pagamento
confirmRentalBtn.addEventListener('click', function() {
    paymentModal.classList.add('active');
});

// Fechar modal de pagamento
closePaymentModal.addEventListener('click', function() {
    paymentModal.classList.remove('active');
});

// Fechar modal ao clicar fora
window.addEventListener('click', function(e) {
    if (e.target === paymentModal) {
        paymentModal.classList.remove('active');
    }
    if (e.target === successModal) {
        successModal.classList.remove('active');
    }
});

// Processar pagamento
paymentModalForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Simular processamento
    setTimeout(() => {
        // Fechar modal de pagamento
        paymentModal.classList.remove('active');

        // Mostrar modal de sucesso
        successModal.classList.add('active');
    }, 1000);
});

// Acompanhar pedido
trackOrderBtn.addEventListener('click', function() {
    // Fechar modal de sucesso
    successModal.classList.remove('active');

    // Mostrar a seção de entrega
    deliverySection.classList.add('active');

    // Marcar etapa de pagamento como concluída
    timelinePayment.classList.add('completed');
    timelinePayment.classList.add('active');

    // Simular progresso da entrega
    setTimeout(() => {
        timelinePreparation.classList.add('completed');
        timelinePreparation.classList.add('active');

        setTimeout(() => {
            timelineShipping.classList.add('completed');
            timelineShipping.classList.add('active');

            // Scroll para a seção de entrega
            deliverySection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 2000);
    }, 1000);
});