.text
    mov r0, #0
    mov r1, #4
    ldrh r2, [r1, r0]
    ldrsh r3, [r1, r0]
    ldrsh r4, [r0, r0]

.data
    .word 0x7FFF
    .word 0xFFFFFFFF
    .word 0x02
