import React, { useLayoutEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

function SSHTerminal({ wsUrl }) {
    const terminalRef = useRef(null);
    const term = useRef(null);
    const fitAddon = useRef(null);
    const ws = useRef(null);

    useLayoutEffect(() => {
        if (!terminalRef.current) return;

        term.current = new Terminal({
            cursorBlink: true,
            cols: 80,
            rows: 24,
            disableStdin: false,
            convertEol: true,
            allowTransparency: true,
            fontSize: 14
        });

        fitAddon.current = new FitAddon();
        term.current.loadAddon(fitAddon.current);
        term.current.open(terminalRef.current);

        // Hàm fit terminal và sau đó mới tạo WebSocket
        const fitAndConnect = () => {
            if (terminalRef.current.offsetWidth && terminalRef.current.offsetHeight) {
                try {
                    fitAddon.current.fit();

                    ws.current = new WebSocket(wsUrl);

                    ws.current.onopen = () => {
                        term.current.writeln('\x1b[32m[Connected to SSH]\x1b[m');
                    };




                    ws.current.onmessage = (event) => {
                        // console.log("RECV:", event.data);  // Kiểm tra dữ liệu server gửi về
                        term.current.write(event.data);
                    };



                    ws.current.onclose = () => {
                        term.current.writeln('\r\n\x1b[31m[Disconnected]\x1b[m');
                    };
                    // term.current.onData(data => {
                    //     console.log("SEND:", data);
                    //     ws.current.send(data);
                    // });
                    term.current.onData(data => {
                        ws.current.send(data);
                    });

                } catch (err) {
                    console.error('fitAddon.fit() failed:', err);
                }
            } else {
                // Nếu chưa có kích thước thì thử lại sau 100ms
                setTimeout(fitAndConnect, 100);
            }
        };

        fitAndConnect();

        const handleResize = () => {
            try {
                fitAddon.current.fit();
            } catch (e) {
                console.error('Resize fit failed:', e);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            console.log('SSHTerminal unmounting with wsUrl:', wsUrl);
            ws.current?.close();
            term.current?.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, [wsUrl]);

    return (
        <div
            ref={terminalRef}
            style={{
                width: '100%',
                height: '400px',
                backgroundColor: 'black',
            }}
        />
    );
}

export default SSHTerminal;
