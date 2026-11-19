/**
 * One-Pager Commercial Offer Generator
 * GeoLab • The art of using AI
 */

// Initial State
let state = {
  clientName: '',
  clientLogo: null, // Base64 data URL
  clientLogoFileName: '',
  bgColor: '#FFFFFF', // Selected background palette color
  bgName: 'Pure White',
  offerSummary: '',
  offerDate: '',
  validUntil: '',
  contactPerson: '',
  offerNumber: 'GEO-AI-' + new Date().getFullYear() + '-01',
  currency: '₾',
  vatType: 'exclusive', // 'none', 'exclusive', 'inclusive'
  discountPercent: 0,
  additionalTerms: 'ანგარიშსწორება ხორციელდება უნაღდო ანგარიშსწორების ფორმით, მიღება-ჩაბარების აქტის გაფორმებიდან 5 (ხუთი) სამუშაო დღის ვადაში.',
  authorName: 'GeoLab / The Art of Using AI Team',
  contactEmail: 'info@geolab.edu.ge',
  items: [
    {
      id: Date.now(),
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0
    }
  ]
};

// DOM Elements
const elements = {
  // Inputs
  clientName: document.getElementById('clientName'),
  offerSummary: document.getElementById('offerSummary'),
  offerDate: document.getElementById('offerDate'),
  validUntil: document.getElementById('validUntil'),
  contactPerson: document.getElementById('contactPerson'),
  offerNumber: document.getElementById('offerNumber'),
  currencySelect: document.getElementById('currencySelect'),
  vatType: document.getElementById('vatType'),
  discountPercent: document.getElementById('discountPercent'),
  additionalTerms: document.getElementById('additionalTerms'),
  authorName: document.getElementById('authorName'),
  contactEmail: document.getElementById('contactEmail'),
  itemsContainer: document.getElementById('itemsContainer'),

  // Feature 1: Client Logo Elements
  clientLogoInput: document.getElementById('clientLogoInput'),
  logoDropZone: document.getElementById('logoDropZone'),
  logoUploadPlaceholder: document.getElementById('logoUploadPlaceholder'),
  logoPreviewContainer: document.getElementById('logoPreviewContainer'),
  clientLogoThumb: document.getElementById('clientLogoThumb'),
  clientLogoFileName: document.getElementById('clientLogoFileName'),
  btnRemoveClientLogo: document.getElementById('btnRemoveClientLogo'),
  pvClientLogoWrapper: document.getElementById('pvClientLogoWrapper'),
  pvClientLogo: document.getElementById('pvClientLogo'),

  // Feature 2: Color Palette Elements
  colorSwatches: document.querySelectorAll('.color-swatch-btn'),
  customBgColor: document.getElementById('customBgColor'),
  activeColorName: document.getElementById('activeColorName'),
  printArea: document.getElementById('printArea'),

  // Buttons
  btnAddItem: document.getElementById('btnAddItem'),
  btnAddItemBottom: document.getElementById('btnAddItemBottom'),
  btnLoadSample: document.getElementById('btnLoadSample'),
  btnClear: document.getElementById('btnClear'),
  btnPrint: document.getElementById('btnPrint'),

  // Preview elements
  pvOfferNumber: document.getElementById('pvOfferNumber'),
  pvOfferDate: document.getElementById('pvOfferDate'),
  pvValidUntil: document.getElementById('pvValidUntil'),
  pvClientName: document.getElementById('pvClientName'),
  pvContactPerson: document.getElementById('pvContactPerson'),
  pvOfferSummary: document.getElementById('pvOfferSummary'),
  pvItemsTableBody: document.getElementById('pvItemsTableBody'),
  pvSubtotal: document.getElementById('pvSubtotal'),
  pvDiscountRow: document.getElementById('pvDiscountRow'),
  pvDiscountRate: document.getElementById('pvDiscountRate'),
  pvDiscountAmount: document.getElementById('pvDiscountAmount'),
  pvVatRow: document.getElementById('pvVatRow'),
  pvVatAmount: document.getElementById('pvVatAmount'),
  pvGrandTotal: document.getElementById('pvGrandTotal'),
  pvTermsBox: document.getElementById('pvTermsBox'),
  pvTermsText: document.getElementById('pvTermsText'),
  pvAuthorName: document.getElementById('pvAuthorName'),
  pvContactEmail: document.getElementById('pvContactEmail'),
  pvClientSignName: document.getElementById('pvClientSignName'),
  pvContactPersonSign: document.getElementById('pvContactPersonSign')
};

// Format currency number (e.g. 1,250.00)
function formatMoney(amount, currency) {
  return new Intl.NumberFormat('ka-GE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount) + ' ' + currency;
}

// Format dates nicely
function formatDateString(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

// Set Default Dates (Today & +14 Days)
function setDefaultDates() {
  const today = new Date();
  const valid = new Date();
  valid.setDate(today.getDate() + 14);

  const formatISO = (d) => d.toISOString().split('T')[0];
  state.offerDate = formatISO(today);
  state.validUntil = formatISO(valid);

  elements.offerDate.value = state.offerDate;
  elements.validUntil.value = state.validUntil;
}

// Calculate financial totals
function calculateFinancials() {
  const subtotal = state.items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    return sum + (qty * price);
  }, 0);

  const discountRate = Math.min(Math.max(parseFloat(state.discountPercent) || 0, 0), 100);
  const discountAmount = subtotal * (discountRate / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);

  let vatAmount = 0;
  let grandTotal = 0;

  if (state.vatType === 'exclusive') {
    vatAmount = taxableAmount * 0.18;
    grandTotal = taxableAmount + vatAmount;
  } else if (state.vatType === 'inclusive') {
    vatAmount = taxableAmount - (taxableAmount / 1.18);
    grandTotal = taxableAmount;
  } else {
    vatAmount = 0;
    grandTotal = taxableAmount;
  }

  return {
    subtotal,
    discountRate,
    discountAmount,
    vatAmount,
    grandTotal
  };
}

// Render dynamic items list in editor form
function renderEditorItems() {
  elements.itemsContainer.innerHTML = '';

  state.items.forEach((item, index) => {
    const itemRow = document.createElement('div');
    itemRow.className = 'item-row-card p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-2';
    
    const lineTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);

    itemRow.innerHTML = `
      <div class="flex items-center justify-between gap-2">
        <span class="text-[11px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">#${index + 1}</span>
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-slate-700">ჯამი: <span class="text-blue-600">${formatMoney(lineTotal, state.currency)}</span></span>
          ${state.items.length > 1 ? `
            <button type="button" class="btn-delete-item text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors" data-id="${item.id}" title="წაშლა">
              <i class="ph-bold ph-trash text-sm"></i>
            </button>
          ` : ''}
        </div>
      </div>

      <div class="space-y-1.5">
        <input type="text" placeholder="პროდუქტის / მომსახურების დასახელება *" value="${escapeHtml(item.name)}" 
          class="item-name-input w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" data-id="${item.id}">
        
        <input type="text" placeholder="მოკლე დაზუსტება / აღწერა (არასავალდებულო)" value="${escapeHtml(item.description)}" 
          class="item-desc-input w-full text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" data-id="${item.id}">
      </div>

      <div class="grid grid-cols-2 gap-2 pt-0.5">
        <div>
          <label class="block text-[10px] font-semibold text-slate-500 mb-0.5">რაოდენობა</label>
          <input type="number" min="1" step="1" value="${item.quantity}" 
            class="item-qty-input w-full text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" data-id="${item.id}">
        </div>
        <div>
          <label class="block text-[10px] font-semibold text-slate-500 mb-0.5">ერთ. ფასი (${state.currency})</label>
          <input type="number" min="0" step="any" value="${item.unitPrice}" 
            class="item-price-input w-full text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium" data-id="${item.id}">
        </div>
      </div>
    `;

    elements.itemsContainer.appendChild(itemRow);
  });

  attachItemEventListeners();
}

// Escape HTML for inputs
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Attach listeners for dynamic items
function attachItemEventListeners() {
  document.querySelectorAll('.item-name-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const id = Number(e.target.dataset.id);
      const item = state.items.find(i => i.id === id);
      if (item) item.name = e.target.value;
      updateLivePreview();
      saveState();
    });
  });

  document.querySelectorAll('.item-desc-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const id = Number(e.target.dataset.id);
      const item = state.items.find(i => i.id === id);
      if (item) item.description = e.target.value;
      updateLivePreview();
      saveState();
    });
  });

  document.querySelectorAll('.item-qty-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const id = Number(e.target.dataset.id);
      const item = state.items.find(i => i.id === id);
      if (item) {
        item.quantity = parseFloat(e.target.value) || 0;
        updateLivePreview();
        renderEditorItems();
        saveState();
      }
    });
  });

  document.querySelectorAll('.item-price-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const id = Number(e.target.dataset.id);
      const item = state.items.find(i => i.id === id);
      if (item) {
        item.unitPrice = parseFloat(e.target.value) || 0;
        updateLivePreview();
        renderEditorItems();
        saveState();
      }
    });
  });

  document.querySelectorAll('.btn-delete-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.currentTarget.dataset.id);
      if (state.items.length > 1) {
        state.items = state.items.filter(i => i.id !== id);
        renderEditorItems();
        updateLivePreview();
        saveState();
      }
    });
  });
}

// Add new empty item
function addNewItem() {
  state.items.push({
    id: Date.now(),
    name: '',
    description: '',
    quantity: 1,
    unitPrice: 0
  });
  renderEditorItems();
  updateLivePreview();
  saveState();
}

// --------------------------------------------------------------------------
// Feature 1: Client Logo Upload & Preview Handling
// --------------------------------------------------------------------------
function setupClientLogoHandlers() {
  // Click dropzone to open file selector
  elements.logoDropZone.addEventListener('click', (e) => {
    // If remove button was clicked, don't trigger file dialog
    if (e.target.closest('#btnRemoveClientLogo')) return;
    elements.clientLogoInput.click();
  });

  // File chosen via input
  elements.clientLogoInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) handleLogoFile(file);
  });

  // Drag and Drop events
  elements.logoDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.logoDropZone.classList.add('dragover');
  });

  elements.logoDropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    elements.logoDropZone.classList.remove('dragover');
  });

  elements.logoDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    elements.logoDropZone.classList.remove('dragover');
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handleLogoFile(file);
  });

  // Remove Logo Button
  elements.btnRemoveClientLogo.addEventListener('click', (e) => {
    e.stopPropagation();
    removeClientLogo();
  });
}

function handleLogoFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('გთხოვთ აირჩიოთ სურათის ფაილი (PNG, JPG, SVG, WebP).');
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    state.clientLogo = event.target.result;
    state.clientLogoFileName = file.name;
    renderClientLogoUI();
    saveState();
  };
  reader.readAsDataURL(file);
}

function removeClientLogo() {
  state.clientLogo = null;
  state.clientLogoFileName = '';
  elements.clientLogoInput.value = '';
  renderClientLogoUI();
  saveState();
}

function renderClientLogoUI() {
  if (state.clientLogo) {
    // Show thumbnail in editor
    elements.logoUploadPlaceholder.classList.add('hidden');
    elements.logoPreviewContainer.classList.remove('hidden');
    elements.clientLogoThumb.src = state.clientLogo;
    elements.clientLogoFileName.textContent = state.clientLogoFileName || 'client-logo.png';

    // Show in A4 One-Pager Preview
    elements.pvClientLogoWrapper.classList.remove('hidden');
    elements.pvClientLogo.src = state.clientLogo;
  } else {
    // Hide in editor
    elements.logoUploadPlaceholder.classList.remove('hidden');
    elements.logoPreviewContainer.classList.add('hidden');
    elements.clientLogoThumb.src = '';
    elements.clientLogoFileName.textContent = '';

    // Hide cleanly in A4 One-Pager Preview (no broken icon)
    elements.pvClientLogoWrapper.classList.add('hidden');
    elements.pvClientLogo.src = '';
  }
}

// --------------------------------------------------------------------------
// Feature 2: Background Color Palette Selector Handling
// --------------------------------------------------------------------------
function setupColorPaletteHandlers() {
  // Preset Swatch buttons
  elements.colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const color = swatch.dataset.color;
      const name = swatch.dataset.name;
      setBackgroundColor(color, name);
    });
  });

  // Custom Color Picker
  elements.customBgColor.addEventListener('input', (e) => {
    const color = e.target.value;
    setBackgroundColor(color, 'Custom: ' + color.toUpperCase());
  });
}

function setBackgroundColor(colorHex, colorName) {
  state.bgColor = colorHex;
  state.bgName = colorName || colorHex;

  // Apply smoothly to preview A4 sheet
  elements.printArea.style.backgroundColor = colorHex;

  // Update label
  if (elements.activeColorName) {
    elements.activeColorName.textContent = state.bgName;
  }

  // Update active swatch indicator ring
  elements.colorSwatches.forEach(swatch => {
    const isMatch = swatch.dataset.color.toLowerCase() === colorHex.toLowerCase();
    const checkIcon = swatch.querySelector('i');
    if (isMatch) {
      swatch.classList.add('active');
      if (checkIcon) checkIcon.classList.remove('hidden');
    } else {
      swatch.classList.remove('active');
      if (checkIcon) checkIcon.classList.add('hidden');
    }
  });

  // Sync custom picker value
  if (elements.customBgColor) {
    elements.customBgColor.value = colorHex.startsWith('#') && colorHex.length === 7 ? colorHex : '#FFFFFF';
  }

  saveState();
}

// --------------------------------------------------------------------------
// Update Live Preview in the right panel
// --------------------------------------------------------------------------
function updateLivePreview() {
  // Document header and details
  elements.pvOfferNumber.textContent = state.offerNumber || 'GEO-AI-2026-01';
  elements.pvOfferDate.textContent = formatDateString(state.offerDate);
  elements.pvValidUntil.textContent = formatDateString(state.validUntil);

  // Client info
  elements.pvClientName.textContent = state.clientName.trim() || '(მიუთითეთ ორგანიზაციის სახელი)';
  elements.pvClientSignName.textContent = state.clientName.trim() || '-';
  
  if (state.contactPerson.trim()) {
    elements.pvContactPerson.textContent = 'საკონტაქტო პირი: ' + state.contactPerson;
    elements.pvContactPersonSign.textContent = state.contactPerson;
  } else {
    elements.pvContactPerson.textContent = '';
    elements.pvContactPersonSign.textContent = '-';
  }

  // Summary
  elements.pvOfferSummary.textContent = state.offerSummary.trim() || '(მიუთითეთ შეთავაზების მოკლე აღწერა ან მიზანი)';

  // Author and Email
  elements.pvAuthorName.textContent = state.authorName || 'GeoLab / The Art of Using AI';
  elements.pvContactEmail.textContent = state.contactEmail || 'info@geolab.edu.ge';

  // Terms & Conditions
  if (state.additionalTerms.trim()) {
    elements.pvTermsBox.classList.remove('hidden');
    elements.pvTermsText.textContent = state.additionalTerms;
  } else {
    elements.pvTermsBox.classList.add('hidden');
  }

  // Populate dynamic items table
  elements.pvItemsTableBody.innerHTML = '';
  state.items.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.className = index % 2 === 1 ? 'bg-black/[0.02]' : 'bg-transparent';

    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    const lineTotal = qty * price;

    tr.innerHTML = `
      <td class="py-2.5 px-1 text-center font-semibold text-slate-400 text-[11px] align-top">${index + 1}</td>
      <td class="py-2.5 px-2 align-top">
        <div class="font-semibold text-slate-900">${escapeHtml(item.name || 'მომსახურების დასახელება')}</div>
        ${item.description ? `<div class="text-[11px] text-slate-500 mt-0.5 leading-tight">${escapeHtml(item.description)}</div>` : ''}
      </td>
      <td class="py-2.5 px-2 text-center align-top font-medium text-slate-700">${qty}</td>
      <td class="py-2.5 px-2 text-right align-top font-medium text-slate-700">${formatMoney(price, state.currency)}</td>
      <td class="py-2.5 px-2 text-right align-top font-bold text-slate-900">${formatMoney(lineTotal, state.currency)}</td>
    `;
    elements.pvItemsTableBody.appendChild(tr);
  });

  // Calculate totals
  const financials = calculateFinancials();

  elements.pvSubtotal.textContent = formatMoney(financials.subtotal, state.currency);

  // Discount Row
  if (financials.discountRate > 0) {
    elements.pvDiscountRow.classList.remove('hidden');
    elements.pvDiscountRate.textContent = financials.discountRate;
    elements.pvDiscountAmount.textContent = '-' + formatMoney(financials.discountAmount, state.currency);
  } else {
    elements.pvDiscountRow.classList.add('hidden');
  }

  // VAT Row
  if (state.vatType === 'none') {
    elements.pvVatRow.classList.add('hidden');
  } else {
    elements.pvVatRow.classList.remove('hidden');
    const vatLabel = state.vatType === 'inclusive' ? 'დღგ (18% ჩათვლილია):' : 'დღგ (18%):';
    elements.pvVatRow.querySelector('span:first-child').textContent = vatLabel;
    elements.pvVatAmount.textContent = formatMoney(financials.vatAmount, state.currency);
  }

  // Grand Total
  elements.pvGrandTotal.textContent = formatMoney(financials.grandTotal, state.currency);
}

// Sync form values into state
function bindFormInputs() {
  elements.clientName.addEventListener('input', (e) => {
    state.clientName = e.target.value;
    updateLivePreview();
    saveState();
  });

  elements.offerSummary.addEventListener('input', (e) => {
    state.offerSummary = e.target.value;
    updateLivePreview();
    saveState();
  });

  elements.offerDate.addEventListener('change', (e) => {
    state.offerDate = e.target.value;
    updateLivePreview();
    saveState();
  });

  elements.validUntil.addEventListener('change', (e) => {
    state.validUntil = e.target.value;
    updateLivePreview();
    saveState();
  });

  elements.contactPerson.addEventListener('input', (e) => {
    state.contactPerson = e.target.value;
    updateLivePreview();
    saveState();
  });

  elements.offerNumber.addEventListener('input', (e) => {
    state.offerNumber = e.target.value;
    updateLivePreview();
    saveState();
  });

  elements.currencySelect.addEventListener('change', (e) => {
    state.currency = e.target.value;
    renderEditorItems();
    updateLivePreview();
    saveState();
  });

  elements.vatType.addEventListener('change', (e) => {
    state.vatType = e.target.value;
    updateLivePreview();
    saveState();
  });

  elements.discountPercent.addEventListener('input', (e) => {
    state.discountPercent = e.target.value;
    updateLivePreview();
    saveState();
  });

  elements.additionalTerms.addEventListener('input', (e) => {
    state.additionalTerms = e.target.value;
    updateLivePreview();
    saveState();
  });

  elements.authorName.addEventListener('input', (e) => {
    state.authorName = e.target.value;
    updateLivePreview();
    saveState();
  });

  elements.contactEmail.addEventListener('input', (e) => {
    state.contactEmail = e.target.value;
    updateLivePreview();
    saveState();
  });

  // Buttons
  elements.btnAddItem.addEventListener('click', addNewItem);
  elements.btnAddItemBottom.addEventListener('click', addNewItem);
  elements.btnLoadSample.addEventListener('click', loadSampleData);
  elements.btnClear.addEventListener('click', clearAllData);
  elements.btnPrint.addEventListener('click', () => window.print());

  // Setup Feature 1 & 2 Handlers
  setupClientLogoHandlers();
  setupColorPaletteHandlers();
}

// Load Sample Data (GeoLab Corporate AI Training Case)
function loadSampleData() {
  const today = new Date();
  const valid = new Date();
  valid.setDate(today.getDate() + 14);
  const formatISO = (d) => d.toISOString().split('T')[0];

  state = {
    clientName: 'შპს „სინერჯი ინოვაციები“ (Synergy Innovations)',
    clientLogo: null,
    clientLogoFileName: '',
    bgColor: '#FAF8F5', // Warm Ivory sample
    bgName: 'Warm Ivory',
    offerSummary: 'კომპანიის თანამშრომელთათვის გენერაციული ხელოვნური ინტელექტის (Generative AI) ინსტრუმენტებისა და პრომპტ-ინჟინერიის პრაქტიკული ვორქშოპების ჩატარება, სამუშაო პროცესების ავტომატიზაციისა და პროდუქტიულობის გაზრდის მიზნით.',
    offerDate: formatISO(today),
    validUntil: formatISO(valid),
    contactPerson: 'ნინო ჩხეიძე (HR & ტალანტების განვითარების ხელმძღვანელი)',
    offerNumber: 'GEO-AI-' + today.getFullYear() + '-08',
    currency: '₾',
    vatType: 'exclusive',
    discountPercent: 5,
    additionalTerms: 'ანგარიშსწორება ხორციელდება 2 ეტაპად: 50% ხელშეკრულების გაფორმებისას, 50% ტრენინგ-კურსის დასრულებისა და მიღება-ჩაბარების აქტის საფუძველზე.',
    authorName: 'GeoLab / The Art of Using AI Team',
    contactEmail: 'info@geolab.edu.ge',
    items: [
      {
        id: 1,
        name: 'The art of using AI: კორპორატიული ინტენსივი (12 საათი)',
        description: 'პრაქტიკული მოდულები: LLM მოდელები, Prompt Engineering Frameworks, სამუშაო ნაკადების ავტომატიზაცია.',
        quantity: 1,
        unitPrice: 3800
      },
      {
        id: 2,
        name: 'ინდივიდუალური AI აგენტებისა და შაბლონების აწყობის მენტორინგი',
        description: 'კომპანიის სპეციფიკაზე მორგებული პერსონალური ასისტენტების შექმნა, ტესტირება და გუნდში ინტეგრაცია.',
        quantity: 2,
        unitPrice: 1200
      },
      {
        id: 3,
        name: 'სასწავლო მასალები და AI რესურსების ბაზაზე წვდომა (ლიცენზია)',
        description: 'სრული სასწავლო გაიდები, ჩეთ-შაბლონების ბიბლიოთეკა და 1-წლიანი განახლებადი ცოდნის ბაზა.',
        quantity: 15,
        unitPrice: 80
      }
    ]
  };

  syncStateToInputs();
  renderEditorItems();
  renderClientLogoUI();
  setBackgroundColor(state.bgColor, state.bgName);
  updateLivePreview();
  saveState();
}

// Clear all data (Reset Form)
function clearAllData() {
  if (confirm('ნამდვილად გსურთ მონაცემების გასუფთავება?')) {
    localStorage.removeItem('geolab_offer_state');
    state = {
      clientName: '',
      clientLogo: null,
      clientLogoFileName: '',
      bgColor: '#FFFFFF',
      bgName: 'Pure White',
      offerSummary: '',
      offerDate: '',
      validUntil: '',
      contactPerson: '',
      offerNumber: 'GEO-AI-' + new Date().getFullYear() + '-01',
      currency: '₾',
      vatType: 'exclusive',
      discountPercent: 0,
      additionalTerms: 'ანგარიშსწორება ხორციელდება უნაღდო ანგარიშსწორების ფორმით, მიღება-ჩაბარების აქტის გაფორმებიდან 5 (ხუთი) სამუშაო დღის ვადაში.',
      authorName: 'GeoLab / The Art of Using AI Team',
      contactEmail: 'info@geolab.edu.ge',
      items: [
        {
          id: Date.now(),
          name: '',
          description: '',
          quantity: 1,
          unitPrice: 0
        }
      ]
    };
    setDefaultDates();
    syncStateToInputs();
    renderEditorItems();
    renderClientLogoUI();
    setBackgroundColor('#FFFFFF', 'Pure White');
    updateLivePreview();
  }
}

// Sync State values to input elements
function syncStateToInputs() {
  elements.clientName.value = state.clientName;
  elements.offerSummary.value = state.offerSummary;
  elements.offerDate.value = state.offerDate;
  elements.validUntil.value = state.validUntil;
  elements.contactPerson.value = state.contactPerson;
  elements.offerNumber.value = state.offerNumber;
  elements.currencySelect.value = state.currency;
  elements.vatType.value = state.vatType;
  elements.discountPercent.value = state.discountPercent;
  elements.additionalTerms.value = state.additionalTerms;
  elements.authorName.value = state.authorName;
  elements.contactEmail.value = state.contactEmail;
}

// Local Storage Persistence
function saveState() {
  try {
    localStorage.setItem('geolab_offer_state', JSON.stringify(state));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
}

function loadSavedState() {
  try {
    const saved = localStorage.getItem('geolab_offer_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
        state = { ...state, ...parsed };
      }
    }
  } catch (e) {
    console.warn('LocalStorage load failed', e);
  }
}

// Application Initialization
function init() {
  loadSavedState();
  
  if (!state.offerDate || !state.validUntil) {
    setDefaultDates();
  }

  // If items empty or first load
  if (!state.clientName && state.items.length === 1 && !state.items[0].name) {
    loadSampleData();
  } else {
    syncStateToInputs();
    renderEditorItems();
    renderClientLogoUI();
    setBackgroundColor(state.bgColor || '#FFFFFF', state.bgName || 'Pure White');
    updateLivePreview();
  }

  bindFormInputs();
}

// Start application on DOM Ready
document.addEventListener('DOMContentLoaded', init);
