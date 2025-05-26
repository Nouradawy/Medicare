import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.ECPublicKey;
import java.security.interfaces.ECPrivateKey;
import java.util.Base64;

public class VapidKeyGenerator {
    public static void main(String[] args) throws Exception {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("EC");
        keyGen.initialize(256); // P-256
        KeyPair keyPair = keyGen.generateKeyPair();

        String publicKey = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(((ECPublicKey) keyPair.getPublic()).getEncoded());
        String privateKey = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(((ECPrivateKey) keyPair.getPrivate()).getEncoded());

        System.out.println("Public VAPID Key: " + publicKey);
        System.out.println("Private VAPID Key: " + privateKey);
    }
}