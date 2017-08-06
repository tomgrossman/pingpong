import pprint
import db

class Scorer:
    def __init__(
        self,
    ):
        self.db = db.PlayersDB()


    @classmethod
    def get_winner_and_loser_points(
        cls,
        match_type,
    ):
        if match_type == 'friendly':
            return 2, 1
        elif match_type == 'weekly_tournament':
            return 3, 2
        elif match_type == 'monthly_tournament':
            return 5, 4


    def assign_points_for_matches(
        self,
    ):
        for match in self.db.get_all_played_matches():
            match_winner_id = match['score']['winner']
            if match_winner_id == match['inviter']:
                match_loser_id = match['invitee']
            else:
                match_loser_id = match['inviter']
            match_loser = self.db.get_player_by_id(match_loser_id)
            match_winner = self.db.get_player_by_id(match_winner_id)
            winner_points, loser_points = self.get_winner_and_loser_points(
                match_type=match['type'],
            )
            self.db.update_points_for_match(
                {
                    match_winner_id: winner_points,
                    match_loser_id: loser_points,
                },
            )
            self.db.accept_match(
                match_id=match['_id'],
            )



            pprint.pprint(match_winner)
            pprint.pprint(match_loser)



s = Scorer()
s.assign_points_for_matches()

