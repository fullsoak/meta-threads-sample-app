import { getOrigin } from "fullsoak";
import { createRef, type FunctionComponent, RefObject } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import type { Mention } from "../../services/getThreadsMentions.ts";
import { SlCard, SlTextarea } from "@shoelace-style/shoelace";

const getMentions = async (): Promise<Mention[]> => {
  const resp = await fetch(getOrigin() + "/api/mentions");
  return resp.status === 200 && resp.json() || {};
};

const postReply = async (replyToId: string, text: string): Promise<boolean> => {
  if (!replyToId || !text) return false;
  const resp = await fetch(getOrigin() + "/api/reply", {
    method: "post",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ replyToId, text }),
  });
  // console.log("doReply resp", resp);
  const respBody = await resp.json();
  if (resp.ok && respBody.id) {
    // alert(JSON.stringify(await resp.json()));
    return true;
  } else {
    console.log(resp);
    alert(
      `reply action failed: ${
        respBody.error?.message || JSON.stringify(respBody)
      }`,
    );
    return false;
  }
};

const taRef = createRef();
const dlRef = createRef();

export const Mentions: FunctionComponent = () => {
  const [isLoadingMentions, setIsLoadingMentions] = useState(true);
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [selectedMentionId, setSelectedMentionId] = useState("");
  const [selectedMentionPermaLink, setSelectedMentionPermaLink] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const prevSelectedId = useRef(selectedMentionId);

  useEffect(() => {
    getMentions().then(setMentions).then(() => setIsLoadingMentions(false));
  }, []);

  useEffect(() => {
    // first time a mention card is selected, we set focus on
    // the textarea inside it (subsequent selections will be handled by `taRef`)
    if (!prevSelectedId.current && selectedMentionId) {
      setTimeout(() => {
        const ta = document.querySelector<SlTextarea>(
          `#comment-ta-${selectedMentionId}`,
        );
        ta && (ta.focus());
      }, 50);
    }
    prevSelectedId.current = selectedMentionId;
  }, [selectedMentionId]);

  useEffect(() => {
    taRef.current?.focus();
  }, [taRef.current]);

  const doPostReply = async (...args: [string, string]) => {
    setIsPosting(true);
    const res = await postReply(...args);
    taRef.current && (taRef.current.value = "");
    setIsPosting(false);
    if (res) {
      dlRef.current && (dlRef.current.show());
    }
  };

  // const shouldDisableMutualTextArea = !selectedMentionId || isPosting

  const cardRefs: RefObject<SlCard>[] = [];

  const selectCard = (i: number) => {
    const m = mentions[i];
    if (!m) return;
    setSelectedMentionId(m.id);
    setSelectedMentionPermaLink(m.permalink);
  };

  const simulateCardClick = (i: number) => {
    const card = cardRefs[i];
    card?.current?.click();
  };

  return (
    <div className="mention-box">
      {!mentions.length
        ? (
          <>
            {isLoadingMentions ? <sl-skeleton></sl-skeleton> : (
              <sl-alert open>
                <sl-icon slot="icon" name="info-circle"></sl-icon>
                You don't have any mention on Threads yet. Maybe try commenting
                around? 😉
              </sl-alert>
            )}
          </>
        )
        : (
          <>
            <sl-alert open>
              <sl-icon slot="icon" name="at"></sl-icon>
              Here are the recent Threads posts mentioning you, you celeb 😉
            </sl-alert>
            {mentions.map((m, i) => {
              const isSelected = m.id === selectedMentionId;
              let slCardStyle =
                "transition: --sl-panel-height var(--sl-transition-fast);";
              if (isSelected) {
                slCardStyle +=
                  "--sl-panel-background-color: var(--sl-color-sky-200);";
              }

              const cardRef = createRef();
              cardRefs[i] = cardRef;

              return (
                <sl-card
                  ref={cardRef}
                  className="mention-card"
                  key={m.id}
                  onClick={() => selectCard(i)}
                  onKeyDown={(e) => {
                    if (e.code === "ArrowUp") simulateCardClick(i - 1);
                    if (e.code === "ArrowDown") simulateCardClick(i + 1);
                  }}
                  style={slCardStyle}
                >
                  {m.text}
                  <br />
                  <small>from @{m.username}</small>
                  <a
                    className="clean external-btn"
                    href={m.permalink}
                    target="_blank"
                  >
                    <sl-icon name="box-arrow-up-right"></sl-icon>
                  </a>
                  {isSelected && (
                    <div className="card-comment-box">
                      <sl-textarea
                        id={`comment-ta-${m.id}`}
                        ref={taRef}
                        filled
                        disabled={isPosting}
                        resize="none"
                      >
                      </sl-textarea>
                      <sl-button
                        size="small"
                        disabled={isPosting}
                        variant="primary"
                        onClick={() =>
                          doPostReply(selectedMentionId, taRef.current?.value)}
                      >
                        Reply
                      </sl-button>
                    </div>
                  )}
                  {/* <div slot="footer"></div> */}
                </sl-card>
              );
            })}
          </>
        )}

      {
        /* <div className="mutual-textarea"><sl-textarea ref={taRef} disabled={shouldDisableTextArea} resize="none"></sl-textarea>
      <sl-button disabled={shouldDisableTextArea} variant="primary" onClick={() => doPostReply(selectedMentionId, taRef.current?.value)}>Reply to selected Mention</sl-button></div> */
      }

      <sl-dialog
        ref={dlRef}
        label="Reply posted"
        className="dialog-overview"
        style="--width: 300px"
      >
        Please click <a href={selectedMentionPermaLink} target="_blank">here</a>
        {" "}
        to see the Thread.
      </sl-dialog>
    </div>
  );
};
