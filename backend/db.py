import pymongo
import pprint
import bson.objectid

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
            self.mongo_session.users.update_one(
                {'_id': _id},
                {
                    '$set': {
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
                self.mongo_session.users.delete_many({'_id':_id})
            except Exception as e:
                print(str(e))

    def get_all_played_matches(
        self,
    ):
        try:
            matches_collection = list(self.mongo_session.matches.find())
            return matches_collection

        except Exception as e:
            print(str(e))

    def get_player_by_id(
        self,
        user_id,
    ):
        return self.mongo_session.users.find_one(
            filter={
                '_id': user_id,
            },
        )

    def update_points_for_match(
        self,
        users_id_to_points,
    ):

        for user_id,points in users_id_to_points.items():
            user = self.get_user_by_id(
                user_id=user_id,
            )
            user['points'] += points
            self.mongo_session.users.update(
                {
                    '_id': bson.objectid.ObjectId(user_id),
                },
                user,
            )

    def get_match_by_id(
        self,
        match_id,
    ):
        match = self.mongo_session.matches.find_one(
            filter={
                '_id': match_id,
            },
        )
        return match

    def get_user_by_id(
        self,
        user_id,
    ):
        user = self.mongo_session.users.find_one(
            filter={
                '_id': user_id,
            },
        )
        return user

    def finalize_match(
        self,
        match_id,
    ):
        match = self.get_match_by_id(
            match_id=match_id,
        )
        match['status'] = 'points_assigned'
        self.mongo_session.matches.update(
            {
                '_id': bson.objectid.ObjectId(match_id),
            },
            match,
        )


if __name__ == '__main__':
    db = PlayersDB()
    # pprint.pprint(db.get_all_players())
    match = db.get_all_played_matches()[0]
    # db.finalize_match(match['_id'])
