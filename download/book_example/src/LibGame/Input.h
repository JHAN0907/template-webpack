#ifndef INPUTH
#define INPUTH


#define DIRECTINPUT_VERSION 0x0800
#include <dinput.h>
#include <vector>
using namespace std;


#define MAX_PLAYERS 16
#define MAX_BUTTONS 128


//==============================================================
// マウス情報
typedef struct {
	int X, Y;
	bool LButton, MButton, RButton;
} MOUSE_STATE;

//==============================================================
// 入力状態
class CInputState {
public:
	bool Up, Down, Left, Right, Button[MAX_BUTTONS],
		Up2, Down2, Left2, Right2;
	float AnalogX, AnalogY, AnalogX2, AnalogY2;
	CInputState();
	void Clear();
};

//==============================================================
// 入力
class CInput {
private:

	CInputState State[MAX_PLAYERS];
	LPDIRECTINPUT8 DI;
	LPDIRECTINPUTDEVICE8 Keyboard;
	vector<LPDIRECTINPUTDEVICE8> JoySticks;
	void FreeResources();

public:

	CInput(HWND hwnd);
	~CInput();
	void UpdateState();
	const CInputState* GetState(int player) {
		return &State[player];
	}
	void ClearState();

	BOOL CALLBACK EnumJoysticksCallback(
		const DIDEVICEINSTANCE* did);
};




#endif
