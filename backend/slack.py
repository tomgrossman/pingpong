import slacker


class Notifier:
    api_token = 'xoxp-7265543094-163948479062-223668098486-62b41262fd31d69176bff976869eed94'
    notifier_user_ref = '@pingping'

    def __init__(
        self,
    ):
        self.slack_client = slacker.Slacker(self.api_token)

    def notify_user(
        self,
        user,
        message,
    ):
        user_ref = '@{user}'.format(
            user=user,
        )
        self.slack_client.chat.post_message(
            channel=user_ref,
            text=message,
            username=self.notifier_user_ref,
        )

    def notify_user_by_email(
        self,
        email,
        message,
    ):
        user = self.get_user_ref_by_email(
            email=email,
        )
        user_ref = '@{user}'.format(
            user=user,
        )
        self.notify_user(
            user=user_ref,
            message=message,
        )

    def get_user_ref_by_email(
        self,
        email,
    ):
        for user in self.slack_client.users.list().body['members']:
            if user['profile']['email'] == email:
                return user['name']
        else:
            raise ValueError(
                'Could not find user by email \'{email}\'.'.format(
                    email=email
                ),
            )
