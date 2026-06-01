#include <stdio.h>

typedef unsigned char U8;
typedef unsigned short U16;
typedef unsigned int U32;

typedef struct {
	U32	ResLen;
	U16	ResId;
	U16	ItmCnt;
	U32	ItmLen;
	U8	ResKey;
	U8	Reserved;
} RCHEAD;

typedef struct {
	U32	offset;
	U32	rlen;
} RIDX;

int main() {
    printf("RCHEAD size: %lu\n", sizeof(RCHEAD));
    printf("RIDX size: %lu\n", sizeof(RIDX));
    return 0;
}
