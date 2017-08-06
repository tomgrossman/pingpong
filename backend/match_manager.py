import datetime
import threading
import base_manager


class MatchManager(
    base_manager.BaseManager,
):
    invite_message = '''You have been invited to a {match_type} ping pong match by {inviter_name}.
        Click here to accept {invite_link}.'''
    accept_message = '''Your invitation to a {match_type} ping pong match has been accepted by {invitee_name}.'''
    score_set_message = '''The winner of your match with {player} has been set to {winner}, please click here to accept: {match_result_link}'''

    def __init__(self):
        super().__init__()
        self.lock = threading.Lock()

    def get_new_matches_and_send_invite(self):
        for match in self.db.get_matches_with_status(
            status='new',
        ):
            invitee = self.db.get_player_by_id(
                user_id=match['invitee']
            )
            inviter = self.db.get_player_by_id(
                user_id=match['inviter']
            )
            self.notifier.notify_slack_user_by_user_email(
                user_email=invitee['email'],
                message=self.invite_message.format(
                    match_type=match['type'],
                    inviter_name=inviter['full_name'],
                    invite_link=self.create_match_invite_link(
                        match=match,
                    ),
                ),
            )

    def get_approval_for_match_result(self):
        for match in self.db.get_matches_with_status(
            status='played',
        ):
            score_set_by_user_id = match['score']['score_added_by_user']
            winner_id = match['score']['winner']

            if score_set_by_user_id == match['invitee']:
                confirming_user_id = match['inviter']
            else:
                confirming_user_id = match['invitee']
            confirming_user = self.db.get_player_by_id(
                user_id=confirming_user_id
            )
            score_set_user = self.db.get_player_by_id(
                user_id=score_set_by_user_id
            )
            if winner_id == match['invitee']:
                winning_user = match['invitee']
            else:
                winning_user = match['inviter']

            self.notifier.notify_slack_user_by_user_email(
                user_email=confirming_user['email'],
                message=self.score_set_message.format(
                    player=score_set_user['full_name'],
                    winner=winning_user['full_name'],
                    match_result_link=self.create_match_result_accept_link(
                        match=match,
                    ),
                ),
            )

    def accept_match_invitation(
        self,
        match_id,
    ):
        with self.lock:
            match = self.db.get_match_by_id(
                match_id=match_id,
            )
            if match['status'] == 'new':

                self.db.accept_match(
                    match_id=match_id,
                )
                inviter = self.db.get_player_by_id(
                    user_id=match['inviter']
                    )
                invitee = self.db.get_player_by_id(
                    user_id=match['invitee']
                    )
                self.notifier.notify_slack_user_by_user_email(
                    user_email=inviter['email'],
                    message=self.accept_message.format(
                        match_type=match['type'],
                        invitee_name=invitee['full_name'],
                    ),
                )

                return '''
                    <head>
                        <title>Match Accepted</title>
                    </head>
                    <body>
                        <h1>
                            Match accepted, you may now close this window.
                        </h1>
                    </body>'''
            else:
                return 'Match already accepted.'

    def create_match_invite_link(
        self,
        match,
    ):
        return 'http://{ip_address}:8080/accept_match_invite/{match_id}'.format(
            ip_address=self.get_local_ip_addresses()[0],
            match_id=match['_id'],
        )

    def create_match_result_accept_link(
        self,
        match,
    ):
        return 'http://{ip_address}:8080/accept_match_score/{match_id}'.format(
            ip_address=self.get_local_ip_addresses()[0],
            match_id=match['_id'],
        )
