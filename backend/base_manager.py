import netifaces
import db
import slack


class BaseManager:
    def __init__(
        self,
    ):
        self.db = db.PlayersDB()
        self.notifier = slack.Notifier()

    def get_local_ip_addresses(self):
        addresses = []
        for interface in netifaces.interfaces():
            for address in netifaces.ifaddresses(interface).get(2, []):
                if address["addr"] != "127.0.0.1":
                    addresses.append(address["addr"])
        return addresses
