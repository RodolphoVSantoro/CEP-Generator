 const url = chrome.runtime.getURL('ceps/cep.bin');

let CEPLabel;
let CEPText;
let CEPButton;
let CEPButtonCopy;

function getRandomCep(CepBinary) {
	const ceps =  new Int32Array(CepBinary);
	const cepsView = new DataView(CepBinary);
	const random = Math.floor(Math.random() * ceps.length);
	const cep = cepsView.getInt32(random * 4).toString().padStart(8, '0');
	const formattedCEP = cep.slice(0,5) + '-' + cep.slice(5, 8);
	return formattedCEP;
}

async function generateText() {
	if(CEPText) {
		const response = await fetch(url).catch((_) => {
			CEPText.nodeValue = 'Failed to fetch bin file';
			return;
		});
		if(response.status !== 200) {
			CEPText.nodeValue = 'Response status: ' + response.status;
			return;
		}
		const parsedBytes = await response.arrayBuffer().catch((_)=>{
			CEPText.nodeValue = 'Failed to parse response';
			return;
		});
		CEPText.nodeValue = getRandomCep(parsedBytes);
	}
}

function copyToClipboard(text) {
	navigator.clipboard.writeText(text);
}

async function main() {
	CEPLabel = document.getElementById('CEPLabel');
	CEPText = document.createTextNode('');
	await generateText();
	CEPButton = document.getElementById('CEPButton');
	CEPLabel.appendChild(CEPText);
	CEPButton.addEventListener('click', generateText);
	CEPButtonCopy = document.getElementById('CEPButtonCopy');
	CEPButtonCopy.addEventListener('click', () => copyToClipboard(CEPText.nodeValue));
}

window.onload = main;
