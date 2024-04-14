import random
import string
import secrets
from json import load
import datetime

class User:
    def __init__(self, id, email, password, name, surname) -> None:
        self.id = id
        self.email = email
        self.password = password
        self.name = name
        self.surname = surname

    def __str__(self) -> str:
        return f' ({self.id}, "{self.email}", "{self.password}", "{self.name}", "{self.surname}"), '

class Group:
    def __init__(self, id, title, duration, creation_date, min_participants, max_participants):
        self.id = id
        self.title = title
        self.duration = duration
        self.creation_date = creation_date
        self.min_participants = min_participants
        self.max_participants = max_participants

    def __str__(self) -> str:
        return f' ({self.id}, "{self.title}", "{self.creation_date}", {self.duration}, {self.min_participants}, {self.max_participants}), '

def generate_password():
    length = random.randint(5, 30)
    characters = string.ascii_letters + string.digits + string.punctuation.replace('"', '9').replace("\\", "&")
    password = ''.join(secrets.choice(characters) for _ in range(length))
    return password

def generate_random_date():
    year = random.randint(2023, 2024)
    month = random.randint(1, 4)
    day = random.randint(1, 14)  # For simplicity, assume all months have up to 28 days
    random_date = datetime.date(year, month, day)
    return random_date.strftime("%Y-%m-%d")

def write_filler(users, groups, creators):
    with open("dbfiller.sql", "w") as f:
        text = ""
        text += "LOCK TABLES `user` WRITE;\n"
        text += "INSERT INTO `user` VALUES "

        for user in users:
            text += str(user)
        text += ";\n"

        text += "LOCK TABLES `group` WRITE;\n"
        text += "INSERT INTO `group` VALUES "

        for group in groups:
            text += str(group)
        text += ";\n"

        text += "LOCK TABLES `created` WRITE;\n"
        text += "INSERT INTO `created` VALUES"

        for i in range(19):
            text += f" ({users[creators[i]].id}, {groups[i].id}), "
        text += ";\n"

        text += "LOCK TABLES `contains` WRITE;\n"
        text += "INSERT INTO `contains` VALUES "
        
        # generate quite the number of groups for each user
        for user in users:
            rand = random.randint(1, 10)
            ids = random.sample(range(0, 20), rand)
            for num in ids:
                if users.index(user) != num:
                    text += f" ({user.id}, {num}), "
        text += ";\n"

        text += "UNLOCK TABLES;"
        
        f.write(text)

if __name__ == "__main__":
    with open("first-names.json") as f:
        names = load(f)
    with open("mails.json") as f:
        mails = load(f)
    with open("wordlist.json") as f:
        words = load(f)

    users = []
    groups = []

    for id in range(1, 50):
           
        name = names[random.randint(0, len(names)-1)]
        surname = names[random.randint(0, len(names)-1)]
        mail = mails[random.randint(0, len(mails)-1)]
        email = f"{name}.{surname}@{mail}"
        password = generate_password()

        user = User(id, email, password, name, surname)
        users.append(user)

    for id in range(1, 20):
        
        title = words[random.randint(0, len(words)-1)]
        duration = random.randint(1, 100)
        creation_date = generate_random_date()
        min_participants = random.randint(2, 20)
        max_participants = 0
        while max_participants < min_participants:
            max_participants = random.randint(2, 30)
        
        group = Group(id, title, duration, creation_date, min_participants, max_participants)
        groups.append(group)

    creators = [random.randint(0, len(users)) for _ in range(20)]

    write_filler(users, groups, creators)
