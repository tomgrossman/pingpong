import slacker


class Notifier:
    api_token = open('./.slack_token').read().strip()
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
        self.notify_user(
            user=user,
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
