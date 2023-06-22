import java.io.*;
import java.net.*;

public class DNSServer {
    public static void main(String[] args) throws IOException {
        File file = new File("ip_addresses1.txt");
        BufferedReader br = new BufferedReader(new FileReader(file));
        DatagramSocket socket = new DatagramSocket(5000);
        System.out.println("DNS server started. Listening on port 5000...");
        
        while (true) {
            byte[] buffer = new byte[1024];
            DatagramPacket requestPacket = new DatagramPacket(buffer, buffer.length);
            socket.receive(requestPacket);
            InetAddress clientAddress = requestPacket.getAddress();
            int clientPort = requestPacket.getPort();
            String domainName = new String(requestPacket.getData(), 0, requestPacket.getLength());
            System.out.println("Received request for domain: " + domainName);
            String ipAddress = "";
            String line;
            while ((line = br.readLine()) != null) {
                if (line.startsWith(domainName)) {
                    ipAddress = line.substring(domainName.length() + 1);
                    break;
                }
            }
            byte[] responseBuffer = ipAddress.getBytes();
            DatagramPacket responsePacket = new DatagramPacket(responseBuffer, responseBuffer.length, clientAddress, clientPort);
            socket.send(responsePacket);
        }
    }
}

