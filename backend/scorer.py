import pprint

import db

class Scorer:
    def __init__(
        self,
    ):
        self.db = db.PlayersDB()

    def assign_scores_for_matches(
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
            pprint.pprint(match_winner)
            pprint.pprint(match_loser)


s = Scorer()
s.assign_scores_for_matches()
