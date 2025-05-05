from abc import ABC, abstractmethod

class RealWorldSimulator(ABC):
    @abstractmethod
    def interact(self, message):
        pass

    @abstractmethod
    def get_state(self):
        pass

class EcommerceSimulator(RealWorldSimulator):
    def __init__(self):
        self.state = {"cart": [], "products": [{"name": "Product 1", "price": 10}, {"name": "Product 2", "price": 20}]}

    def interact(self, message):
        if "add" in message.lower():
            product_name = message.split("add ")[-1]
            for product in self.state["products"]:
                if product["name"].lower() == product_name.lower():
                    self.state["cart"].append(product)
                    return f"{product_name} added to cart."
            return f"Product {product_name} not found."
        elif "list" in message.lower() and "cart" in message.lower():
            return f"Cart: {[product['name'] for product in self.state['cart']]}"

        return "Ecommerce simulator received: " + message

    def get_state(self):
        return self.state

class CodingAssistantSimulator(RealWorldSimulator):
    def __init__(self):
        self.state = {"code_editor": "", "current_task": "Write a function to sum two numbers"}

    def interact(self, message):
        if "write" in message.lower() and "function" in message.lower():
          self.state["code_editor"] = "def sum(a,b): return a + b"
          return "Function created"

        return "Coding assistant received: " + message

    def get_state(self):
        return self.state