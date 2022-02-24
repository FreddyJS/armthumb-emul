# armthumb-emul
Emulator for ARM Thumb Assembly. Library for a web arm thumb ide with code emulation.

## Registers
The ARM Thumb has access to the 16 32-bits registers from `r0` to `r15`.  
* Low Registers: `r[0-7]`  
* High Registers: `r[8-15]`  

## Supported Operations
Operation | Operand 1 | Operand 2 | Signature 
|  :---:  |   :---    |   :---    |  :---   |
MOV | Low Register (Rd) | #8bit_Imm | Ld = #8bit_Imm
MOV | Register (Rd) | Register (Rs) | Rd = Rs |
ADD | Low Register (Rd) | #8bit_Imm | Rd = Rd + #8bit_Imm
ADD | Register (Rd) | Register (Rs) | Rd = Rd + Rs
