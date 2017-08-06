import threading

import base_manager


class TournamentManager(
    base_manager.BaseManager,
):
    tournament_invite_message = '''
    A new {tournament_type} tournament has been created.
    Click the following link to sign up: {registration_link}'''

    def __init__(self):
        super().__init__()
        self.lock = threading.Lock()


    def send_tournament_registration_link(
        self,
        tournament_id,
        tournament_type,
    ):
        for player in self.db.get_all_players():
            invite_message = self.tournament_invite_message.format(
                tournament_type=tournament_type,
                registration_link=self.create_tournament_sign_up_link(
                    tournament_id=tournament_id,
                    player_id=player['_id'],
                    )
                )
            self.notifier.notify_slack_user_by_user_email(
                user_email=player['email'],
                message=invite_message,
            )

    def create_tournament(
        self,
        tournament_type,
    ):
        tournament_id = self.db.create_tournament(
            tournament_type=tournament_type,
        )
        self.send_tournament_registration_link(
            tournament_id=tournament_id,
            tournament_type=tournament_type,
        )


    def create_tournament_sign_up_link(
        self,
        tournament_id,
        player_id,
    ):
        return 'http://{ip_address}:8080/sign_up_for_tournament/{tournament_id}/player/{player_id}'.format(
            ip_address=self.get_local_ip_addresses()[0],
            tournament_id=tournament_id,
            player_id=player_id,
        )

    def sign_up_player_for_tournament(
        self,
        tournament_id,
        player_id,
    ):
        with self.lock:
            if self.db.add_player_to_tournament(
                tournament_id=tournament_id,
                player_id=player_id,
            ):

                return '''You have been registered to the tournament.'''
            else:
                return '''You have already been registered to the tournament.'''

def main():
    t = TournamentManager()
    t.create_tournament('monthly')
main()
