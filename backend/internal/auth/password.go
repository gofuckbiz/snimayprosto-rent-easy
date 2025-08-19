package auth

import (
    "golang.org/x/crypto/bcrypt"
)

func HashPassword(plain string) (string, error) {
    b, err := bcrypt.GenerateFromPassword([]byte(plain), bcrypt.DefaultCost)
    if err != nil {
        return "", err
    }
    return string(b), nil
}

func CheckPassword(hash string, plain string) error {
    return bcrypt.CompareHashAndPassword([]byte(hash), []byte(plain))
}


