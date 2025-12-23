# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - main [ref=e2]:
        - generic [ref=e4]:
            - generic [ref=e5]:
                - generic [ref=e6]: Iniciar Sesión
                - generic [ref=e7]: Ingresa tus credenciales para acceder a PAES Tutor
            - generic [ref=e9]:
                - generic [ref=e10]:
                    - generic [ref=e11]: Email
                    - textbox "Email" [ref=e12]:
                        - /placeholder: tu@email.com
                        - text: matias@paestutor.com
                - generic [ref=e13]:
                    - generic [ref=e14]: Contraseña
                    - textbox "Contraseña" [ref=e15]:
                        - /placeholder: ••••••••
                        - text: password123
                - button "Iniciar Sesión" [ref=e16]
    - region "Notifications alt+T"
    - button "Open Next.js Dev Tools" [ref=e22] [cursor=pointer]:
        - img [ref=e23]
    - alert [ref=e26]
```
