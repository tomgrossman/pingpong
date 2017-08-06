import pymongo
import bson.objectid
import datetime


class PlayersDB:
    def __init__(self):
        self.mongo_session = pymongo.MongoClient('127.0.0.1').ping_pong

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
            matches_collection = list(self.mongo_session.matches.find(
                filter={
                    'status': 'played',
                },
            ))
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

        for user_id, points in users_id_to_points.items():
            user = self.get_user_by_id(
                user_id=user_id,
            )
            # now = datetime.datetime.now()
            # if user['email'] == 'benda@intsights.com' and now.day % 2 == 0:
            #     user['points'] -= 1
            # else:
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
                '_id': bson.objectid.ObjectId(match_id),
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

    def accept_match(
        self,
        match_id,
    ):
        match = self.get_match_by_id(
            match_id=match_id,
        )
        match['status'] = 'accepted'
        self.mongo_session.matches.update(
            {
                '_id': bson.objectid.ObjectId(match_id),
            },
            match,
        )

    def get_existing_tournaments(
        self,
    ):
        return self.mongo_session.tournaments.find()

    def get_matches_with_status(
        self,
        status,
    ):
        return self.mongo_session.matches.find(
            filter={
                'status': status,
            },
        )

    def create_tournament(
        self,
        tournament_type,
    ):
        tournament = {
            'tournament_type': tournament_type,
            'initial_attendees': [],
            'stages': [],
            'creation_date': datetime.datetime.now(),
            'registration_open': True,
            'active': False,
        }
        return self.mongo_session.tournaments.insert(
            tournament,
        )

    def add_player_to_tournament(
        self,
        tournament_id,
        player_id,
    ):

        tournament = self.mongo_session.tournaments.find_one(
            filter={
                '_id': bson.objectid.ObjectId(tournament_id),
            },
        )
        if tournament['registration_open']:
            initial_len = len(tournament['initial_attendees'])
            try:
                tournament['initial_attendees'].append(bson.objectid.ObjectId(player_id))
            except TypeError:
                tournament['initial_attendees'] = [bson.objectid.ObjectId(player_id)]

            tournament['initial_attendees'] = list(set(tournament['initial_attendees']))
            len_after_add = len(tournament['initial_attendees'])

            self.mongo_session.tournaments.update(
                {
                    '_id': bson.objectid.ObjectId(tournament_id),
                },
                tournament,
            )
            player_added = initial_len != len_after_add

            return player_added
        else:
            raise ValueError('Tournament is closed for registration.')

    def start_tournament(
        self,
        tournament,
    ):

        tournament = self.mongo_session.tournaments.find_one(
            filter={
                '_id': bson.objectid.ObjectId(tournament['_id']),
            },
        )

        tournament['registration_open'] = False
        tournament['active'] = True
        self.mongo_session.tournaments.update(
            {
                '_id': bson.objectid.ObjectId(tournament['_id']),
            },
            tournament,
        )

    def end_tournament(
        self,
        tournament_id
    ):
        tournament = self.mongo_session.tournaments.find_one(
            filter={
                '_id': bson.objectid.ObjectId(tournament_id),
                },
            )

        tournament['active'] = False
        self.mongo_session.tournaments.update(
            {
                '_id': bson.objectid.ObjectId(tournament_id),
            },
            tournament,
        )

    def create_tournament_match(
        self,
        inviter_id,
        invitee_id,
        tournament_type,
    ):
        match = {
            "type": tournament_type,
            "inviter": bson.objectid.ObjectId(inviter_id),
            "invitee": bson.objectid.ObjectId(invitee_id),
            "invited_at" : datetime.datetime.now(),
            "status": "new_tournament",
            "score": {}
    }
        return self.mongo_session.matches.insert(
            match,
        )

    def update_tournament(
        self,
        tournament,
    ):

        self.mongo_session.tournaments.update(
            {
                '_id': bson.objectid.ObjectId(tournament['_id']),
            },
            tournament,
        )
