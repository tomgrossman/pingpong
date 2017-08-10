import pprint
import threading

import db

class Scorer:
    def __init__(
        self,
    ):
        self.db = db.PlayersDB()
        self.lock = threading.Lock()

    @classmethod
    def get_winner_and_loser_points(
        cls,
        match_type,
        winner_player_rank,
        loser_player_rank,
    ):
        #TODO: add tournament
        if match_type == 'friendly':
            c = 200
            k = 32
            old_rank = winner_player_rank
            opponent_rank = loser_player_rank

            win = 3
            loss = 0
            winner_new_rank = old_rank + (k/2) * ((win - loss) + (0.5) * ((opponent_rank - old_rank) / c))

            win = 0
            loss = 3
            loser_new_rank = opponent_rank + (k/2) * ((win - loss) + (0.5) * ((old_rank - opponent_rank) / c))

        return winner_new_rank, loser_new_rank

    def assign_points_for_matches(
        self,
    ):
        for match in self.db.get_all_played_matches():
            with self.lock:
                match_winner_id = match['score']['winner']
                if match_winner_id == match['inviter']:
                    match_loser_id = match['invitee']
                else:
                    match_loser_id = match['inviter']
                winner_points, loser_points = self.get_winner_and_loser_points(
                    match_type=match['type'],
                    winner_player_rank=self.db.get_player_by_id(user_id=match_winner_id)['points'],
                    loser_player_rank=self.db.get_player_by_id(user_id=match_loser_id)['points'],
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
