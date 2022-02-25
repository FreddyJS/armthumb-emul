# armthumb-emul
[![Emulator Tests](https://github.com/FreddyJS/armthumb-emul/actions/workflows/tests.yml/badge.svg)](https://github.com/FreddyJS/armthumb-emul/actions/workflows/tests.yml)  

Emulator for ARM Thumb Assembly. Library for a web arm thumb ide with code emulation.  
Reads an assembly code with `gas` syntax, parses it and emulates each operation.  

## Registers
The ARM Thumb has access to the 16 32-bits registers from `r0` to `r15`.  
* Low Registers: `r[0-7]`  
* High Registers: `r[8-15]`  

## Supported Operations
[Instructions Reference](https://developer.arm.com/documentation/ddi0210/c/Introduction/Instruction-set-summary/Thumb-instruction-summary?lang=en)  
Operation | Operand 1 | Operand 2 | Operand 3| Signature 
|  :---:  |   :---    |   :---    |   :---    |  :---   |
MOV | Low Register (Rd) | #8bit_Imm |         | Ld = #8bit_Imm
MOV | Register (Rd) | Register (Rs) |         | Rd = Rs |
ADD | Low Register (Rd) | #8bit_Imm |         | Rd = Rd + #8bit_Imm
ADD | Register (Rd) | Register (Rs) |         | Rd = Rd + Rs
ADD | Register (Rd) | Register (Rs) |         | Rd = Rd + Rs
ADD | Low Register (Rd) | Low Register (Rs) | #3bit_Imm | Rd = Rd + Rs
