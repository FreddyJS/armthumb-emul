.text 
  add r0, #2    ; r0 = 2
  add r0, #0xf  ; r0 = 17
  add r1, r0    ; r1 = 17
  add r2, #0x2  ; r2 = 2
  add r2, r2    ; r2 = 4
  add r8, r2    ; r8 = 4
  add r8, r8    ; r8 = 8
  add r9, r8    ; r9 = 8
  add r9, r9    ; r9 = 16
  add r9, r2    ; r9 = 20
  ; r0 = 17, r1 = 17, r2 = 4, r8 = 8, r9 = 20