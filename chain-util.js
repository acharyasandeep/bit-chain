import pkg from "elliptic";
import sha256 from "crypto-js/sha256.js";
import { v1 as uuidv1 } from "uuid";

const { ec: EC } = pkg;

const ec = EC("secp256k1");

class ChainUtil {
  static genKeyPair() {
    return ec.genKeyPair();
  }

  static id() {
    return uuidv1();
  }

  static hash(data) {
    return sha256(JSON.stringify(data)).toString();
  }

  static verifySignature(publicKey, signature, dataHash) {
    return ec.keyFromPublic(publicKey, "hex").verify(dataHash, signature);
  }
}

export default ChainUtil;
