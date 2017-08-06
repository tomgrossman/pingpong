from . import db
class Scorer:
    def __init__(
        self,
    ):
        self.db = db.PlayersDB()

    def assign_scores_for_matches(
        self,
    ):
        for match in self.db.get_all_played_matches():
            print('MAKAK!')

