.equ one, 1
.equ two, 2

.equ two, 1
.equ one, 2

.text
    mov r1, #one
    mov r2, #two

    add r1, #two
    sub r2, #one
