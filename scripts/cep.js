const url = chrome.runtime.getURL('ceps/cep.bin');

let CEPLabel;
let CEPText;
let CEPButton;
let CEPButtonCopy;
let CEP_BINARY = null;

const usesLittleEndian = true;

async function generateCEP() {
	if (!CEP_BINARY) {
		CEPText.nodeValue = 'Failed to load ceps file';
		return;
	}

	const cepGroups = new Int32Array(CEP_BINARY);
	const cepsView = new DataView(CEP_BINARY);

	const random = Math.floor(Math.random() * cepGroups.length);

	const cepGroup = cepsView.getInt32(random * 4, usesLittleEndian);
	const cep = cepGroup.toString().padStart(8, '0');

	const formattedCEP = cep.slice(0, 5) + '-' + cep.slice(5, 8);
	CEPText.nodeValue = formattedCEP;
}

async function loadCEPFile() {
	const response = await fetch(url).catch((_) => {
		CEPText.nodeValue = 'Failed to fetch bin file';
		return;
	});
	if (response.status !== 200) {
		CEPText.nodeValue = 'Response status: ' + response.status;
		return;
	}
	const parsedBytes = await response.arrayBuffer().catch((_) => {
		CEPText.nodeValue = 'Failed to parse response';
		return;
	});
	if (!parsedBytes) {
		return;
	}
	CEP_BINARY = parsedBytes;
}

function copyToClipboard(text) {
	navigator.clipboard.writeText(text);
}

async function mainCEP() {
	CEPLabel = document.getElementById('CEPLabel');
	CEPText = document.createTextNode('');
	await loadCEPFile();
	await generateCEP();
	CEPButton = document.getElementById('CEPButton');
	CEPLabel.appendChild(CEPText);
	CEPButton.addEventListener('click', generateCEP);
	CEPButtonCopy = document.getElementById('CEPButtonCopy');
	CEPButtonCopy.addEventListener('click', () => copyToClipboard(CEPText.nodeValue));
}
