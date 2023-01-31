# Ada-Membership-Api

## Requirements

|Requirementes                          | User      |
|---                                    |---        |
|Register card                          | Employee  |
|Login                                  | Employee  |
|Log out                                | Employee  |
|Top up account                         | Employee  |
|Purchase items                         | Employee  |
|Change pin                             | Employee  |
|Register Admin Account                 | Admin     |
|Transfer Balance to another account    | Admin     |
|Deactivate Account                     | Admin     |

## Assumptions

- An employee can multiple cards. For example if they lose their card they can request a new card and have their balance  transferred and have their old card deactivated. The transfer of balance and card deactivation would be done by an admin.

- The card already has a unique id on the card before registering.
- You can top up money on the kiosk with cash.
- As there is a PIN I assumed that after swiping the card the Kiosk will ask for the PIN which the user can then sign in with.
- The Kiosk can perform basic tasks such as deleting a token and sending a token in the header when making a request

## UML - Diagrams
## ERD

![Getting Started](UMLAPI.png)

```
Code Block Work Here
    More Code
```

code