import datetime
import random
import threading

import base_manager


class TournamentManager(
    base_manager.BaseManager,
):
    tournament_invite_message = '''
    A new {tournament_type} tournament has been created.
    Click the following link to sign up: {registration_link}'''

    tournament_end_message = '''The tournament has ended, the winner is {winner}.'''

    next_match_message = '''The next match in the tournament is {first_opponent} against {second_opponent}, good luck.'''

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

    def finalize_tournament_registrations(
        self,
    ):
        threshold_time = datetime.datetime.now() - datetime.timedelta(
            hours=24,
        )
        for tournament in self.db.get_existing_tournaments():
            if tournament['creation_date'] < threshold_time:
                self.close_tournament_registrations(
                    tournament=tournament,
                )

    def close_tournament_registrations(
        self,
        tournament,
    ):
        self.db.set_tournament_registration_open(
            tournament_id=tournament['_id'],
            registration_open=False,
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

    def create_next_stage_and_send_invites(
        self,
    ):
        for tournament in self.db.get_existing_tournaments():
            if tournament['active']:
                curr_stage = tournament['stages'][-1]
                if curr_stage is []:
                    bracket_size = self.get_number_of_brackets_for_player_amount(
                        amount_of_players=len(tournament['initial_attendees']),
                    )
                    for bracket_index in range(1, bracket_size + 1):

                        try:
                            first_player_id = random.choices(tournament['initial_attendees'])
                        except IndexError:
                            first_player_id = None
                        else:
                            tournament['initial_attendees'].pop(first_player_id)

                        try:
                            second_player_id = random.choices(tournament['initial_attendees'])
                        except IndexError:
                            second_player_id = None
                        else:
                            tournament['initial_attendees'].pop(second_player_id)
                        tournament_match_id = self.create_tournament_match(
                            invitee_id=first_player_id,
                            inviter_id=second_player_id,
                            tournament_type=tournament['tournament_type'],
                        )
                        tournament['stages'][-1].append(tournament_match_id)
                        self.db.update_tournament(
                            tournament=tournament,
                            )
                        
                        first_player = self.db.get_player_by_id(
                            user_id=first_player_id,
                        )
                        second_player = self.db.get_player_by_id(
                            user_id=second_player_id,
                        )
                        message = self.next_match_message.format(
                            first_opponent=first_player['full_name'],
                            second_opponent=second_player['full_name'],
                        )
                        for player in (
                            first_player,
                            second_player,
                        ):
                            self.notifier.notify_slack_user_by_user_email(
                                    user_email=player['email'],
                                    message=message,
                            )
                else:
                    winners = []
                    for match_id in tournament['stages'][-1]:
                        match = self.db.get_match_by_id(
                            match_id=match_id,
                        )
                        winners.append(match['score']['winner'])
                        if len(winners) == 1:
                            self.end_tournament(
                                tournament=tournament,
                                winner_id=winners[0],
                            )
                        else:
                            for first_player_id, second_player_id in self.pairwise(winners):
                                tournament_match_id = self.create_tournament_match(
                                    invitee_id=first_player_id,
                                    inviter_id=second_player_id,
                                    tournament_type=tournament['tournament_type'],
                                )
                                tournament['stages'][-1].append(tournament_match_id)
                                first_player = self.db.get_player_by_id(
                                    user_id=first_player_id,
                                    )
                                second_player = self.db.get_player_by_id(
                                    user_id=second_player_id,
                                    )
                                message = self.next_match_message.format(
                                    first_opponent=first_player['full_name'],
                                    second_opponent=second_player['full_name'],
                                    )
                                for player in (
                                    first_player,
                                    second_player,
                                ):
                                    self.notifier.notify_slack_user_by_user_email(
                                        user_email=player['email'],
                                        message=message,
                                    )

                        self.db.update_tournament(
                            tournament=tournament,
                        )


    def end_tournament(
        self,
        tournament,
        winner_id,
    ):
        self.db.end_tournament(
            tournament_id=tournament['_id'],
        )
        winner = self.db.get_player_by_id(
            user_id=winner_id,
        )
        end_tournament_message = self.tournament_end_message.format(
            winner=winner['full_name'],
        )
        self.notify_tournament_users(
            tournament=tournament,
            message=end_tournament_message,
        )

    def notify_tournament_users(
        self,
        tournament,
        message,
    ):
        for player_id in tournament['initial_attendees']:
            player = self.db.get_player_by_id(
                user_id=player_id,
                )
            self.notifier.notify_slack_user_by_user_email(
                user_email=player['email'],
                message=message,
                )

    def get_number_of_brackets_for_player_amount(
        self,
        amount_of_players,
        ):

        if amount_of_players > 1:
            for i in range(1, int(amount_of_players)):
                if 2 ** i >= amount_of_players:
                    return 2 ** i / 2
        else:
            return 1


    def create_tournament_match(
        self,
        inviter_id,
        invitee_id,
        tournament_type,
    ):
      return self.db.create_tournament_match(
          invitee_id=invitee_id,
          inviter_id=inviter_id,
          tournament_type=tournament_type,
          )

    @staticmethod
    def pairwise(it):
        it = iter(it)
        while True:
            yield next(it), next(it)
def main():
    t = TournamentManager()
    t.create_tournament('monthly')
main()
