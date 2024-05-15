const fs = require('fs')
const bitcoin = require('bitcoinjs-lib');
const bip39 = require('bip39');
const bsv = require('bsv')
const Mnemonic = require('bsv/mnemonic');
bsv.Mnemonic = Mnemonic;
const list = require('./list.json')

const filePath = 'results.txt';

async function generateNativeSegwitAddress() {

    const mnemonic = bip39.generateMnemonic()

    const seed = bsv.Mnemonic.fromString(mnemonic).toSeed('PiXRP7AB').toString('hex');
    const masterKey = bsv.HDPrivateKey.fromSeed(seed, bitcoin.networks.bitcoin);

    const derivationPath = "m/84'/0'/0'/0/0";
    const child = masterKey.deriveChild(derivationPath);

    const { address } = bitcoin.payments.p2wpkh({ pubkey: child.publicKey.toBuffer() });

    return { mnemonic, address }
}

async function run() {
    while (true) {
        const { mnemonic, address } = await generateNativeSegwitAddress()

        for(let item of list){
            
            if(address.endsWith(item)){
                fs.appendFileSync(filePath, `end | ${address} | ${mnemonic}\n`)
            }else if(address.substring(4).startsWith(item)){
                fs.appendFileSync(filePath, `sta | ${address} | ${mnemonic}\n`)
            }else if(address.includes(item)){
                fs.appendFileSync(filePath, `inc | ${address} | ${mnemonic}\n`)
            }
        }
    }
}

run()