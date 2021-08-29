import React, { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { CenteredViewport } from "@wesdollar/dollar-ui.ui.centered-viewport";
import { MobileContainer } from "@wesdollar/dollar-ui.ui.mobile-container";
import { Body1 } from "@wesdollar/dollar-ui.ui.typography.body1";
import { Tile } from "@wesdollar/dollar-ui.ui.tile";

export const Websocket = () => {
  //Public API that will echo messages sent to it back to the client
  const [socketUrl] = useState(
    "ws://localhost:30303/ws-profits?token=eyJhbGciOiJSUzI1NiIsImtpZCI6IjkwMDk1YmM2ZGM2ZDY3NzkxZDdkYTFlZWIxYTU1OWEzZDViMmM0ODYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiV2VzIERvbGxhciIsInBpY3R1cmUiOiJodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTYyNTkwNz92PTQiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZG9sbGFyLWNyeXB0byIsImF1ZCI6ImRvbGxhci1jcnlwdG8iLCJhdXRoX3RpbWUiOjE2MzAyMDkzMjIsInVzZXJfaWQiOiJjV2JveTQ5U3NTZUFudlZuMDFzRnNJMFJnazMzIiwic3ViIjoiY1dib3k0OVNzU2VBbnZWbjAxc0ZzSTBSZ2szMyIsImlhdCI6MTYzMDI2MTY4NCwiZXhwIjoxNjMwMjY1Mjg0LCJlbWFpbCI6ImdpdGh1YkB3ZXNkb2xsYXIuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImdpdGh1Yi5jb20iOlsiMTYyNTkwNyJdLCJlbWFpbCI6WyJnaXRodWJAd2VzZG9sbGFyLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6ImdpdGh1Yi5jb20ifX0.Vv8ikg_eB05ws_wwab0xW6UHIbf96jj2oixJPE28puR5nrveg1sPq4uybLemtR4cdfldP8aF46H5YfNsSxr-xnWyozMpdNkq_Aub7ccL1f9A2y4_Hnc_UTtqiwVGTj1LLv7-pR5xvzQKQM47GeRyAnB5JIp5Ie8VMK8doQgrMG5VPbcfqBeXZm8I7F9DLPZeL7wn1AUdzM1P1J-znCaMH0_Yxx01M2EmxcXAf5Z2Ch-nI3dImfUBCurDhoIT3j2Q4nkC0BhD2qWYT2Eidc5tQpzbYhzFUYzCQHadW_ZROv0xZ4LE-nMZbGZEq-J2VMy0ZNYS4CwD_7Juc-StxRTPdA"
  );
  const { lastMessage, readyState } = useWebSocket(socketUrl, {}, false);
  const [animal, setAnimal] = useState();

  useEffect(() => {
    console.log(lastMessage?.data, typeof lastMessage?.data);

    if (lastMessage?.data) {
      let parsedMesssage;

      try {
        parsedMesssage = JSON.parse(lastMessage.data);
        console.log(parsedMesssage);
      } catch (error) {
        parsedMesssage = lastMessage.data;
      }

      setAnimal(parsedMesssage);
    }
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <CenteredViewport>
      <MobileContainer>
        <Tile>
          <Body1>The WebSocket is currently {connectionStatus}</Body1>
          {lastMessage ? <Body1>Last message: {animal}</Body1> : null}
        </Tile>
      </MobileContainer>
    </CenteredViewport>
  );
};
