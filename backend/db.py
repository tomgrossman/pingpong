import pymongo


class PlayersDB:
    def __init__(self):
        self.mongo_session = pymongo.MongoClient('10.0.0.232').ping_pong

    def get_all_players(self):
        try:
            players_collection = list(self.mongo_session.users.find())
            return players_collection

        except Exception as e:
            print(str(e))


    def update_player_info(
        self,
        _id,
        email,
        full_name,
        team,
        points,
    ):
        try:
            self.mongo_session.Players.update_one(
                {"_id": _id},
                {
                    "$set": {
                            'email': email,
                            'full_name': full_name,
                            'team': team,
                            'points': points,
                    }
                }
            )
        except Exception as e:
            print(str(e))


    def delete(
        self,
        _id,
        ):
            try:
                self.mongo_session.Players.delete_many({"_id":_id})
            except Exception as e:
                print(str(e))


def main():
    db = PlayersDB()
    print(db.get_all_players())


if __name__ == '__main__':
    main()
