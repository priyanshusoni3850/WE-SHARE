import java.util.ArrayList;
import java.util.List;

public class NetworkSetup {
    public static void main(String[] args) {
        String baseNetwork = "200.55.1."; // Base IP address for all networks
        int currentHost = 1; // Starting host number
        int subnetMask = 24; // Subnet mask

        List<Network> networks = new ArrayList<>();
        networks.add(new Network("Network A", 100));
        networks.add(new Network("Network B", 40));
        networks.add(new Network("Network C", 20));
        networks.add(new Network("Network D", 10));
        networks.add(new Network("Network E", 6));
        networks.add(new Network("Network F", 2));
        for (Network network : networks) {
            String networkAddress = baseNetwork + currentHost + "/" + subnetMask;
            network.setNetworkAddress(networkAddress);
            network.setClassType(getClassType(networkAddress));
            currentHost += network.getNumberOfHosts();
        }
        for (Network network : networks) {
            System.out.println("Network Name: " + network.getName());
            System.out.println("Network Address: " + network.getNetworkAddress());
            System.out.println("Class Type: " + network.getClassType());
            System.out.println();
        }
    }

    private static String getClassType(String networkAddress) {
        String[] octets = networkAddress.split("\\.");
        int firstOctet = Integer.parseInt(octets[0]);
        if (firstOctet >= 0 && firstOctet <= 127) {
            return "Class A";
        } else if (firstOctet >= 128 && firstOctet <= 191) {
            return "Class B";
        } else if (firstOctet >= 192 && firstOctet <= 223) {
            return "Class C";
        } else if (firstOctet >= 224 && firstOctet <= 239) {
            return "Class D";
        } else if (firstOctet >= 240 && firstOctet <= 255) {
            return "Class E";
        }
        return "Unknown";
    }
}

class Network {
    private String name;
    private int numberOfHosts;
    private String networkAddress;
    private String classType;

    public Network(String name, int numberOfHosts) {
        this.name = name;
        this.numberOfHosts = numberOfHosts;
    }

    public String getName() {
        return name;
    }

    public int getNumberOfHosts() {
        return numberOfHosts;
    }

    public String getNetworkAddress() {
        return networkAddress;
    }

    public void setNetworkAddress(String networkAddress) {
        this.networkAddress = networkAddress;
    }

    public String getClassType() {
        return classType;
    }

    public void setClassType(String classType) {
        this.classType = classType;
    }
}
