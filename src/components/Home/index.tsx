import type { FunctionComponent } from "preact";
import type {
  SlAlert,
  SlButton,
  SlCard,
  SlDialog,
  SlIcon,
  SlIconButton,
  SlRating,
  SlSkeleton,
  SlTextarea,
} from "@shoelace-style/shoelace";
import { ThreadsProfile } from "../../services/getThreadsProfile.ts";
import { Mentions } from "../Mentions/index.tsx";

type Props = {
  loggedIn: boolean;
  threadsLoginUrl: string;
  threadsProfile?: ThreadsProfile;
};

const css = `
  .card-overview {
    max-width: 350px;
  }

  .card-overview small {
    color: var(--sl-color-neutral-500);
  }

  .card-overview [slot="footer"] {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

// https://stackoverflow.com/questions/61015445/using-web-components-within-preact-and-typescript
declare module "preact/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "sl-card": HTMLAttributes<SlCard>;
      "sl-button": HTMLAttributes<SlButton> & {
        variant?: string;
        pill?: boolean;
        size?: string;
        disabled?: boolean;
      };
      "sl-rating": HTMLAttributes<SlRating>;
      "sl-textarea": HTMLAttributes<SlTextarea> & {
        resize?: string;
        disabled?: boolean;
        filled?: boolean;
      };
      "sl-icon-button": HTMLAttributes<SlIconButton> & {
        name?: string;
        disabled?: boolean;
      };
      "sl-alert": HTMLAttributes<SlAlert> & {
        open?: boolean;
      };
      "sl-icon": HTMLAttributes<SlIcon> & {
        name?: string;
      };
      "sl-skeleton": HTMLAttributes<SlSkeleton>;
      "sl-dialog": HTMLAttributes<SlDialog> & {
        label?: string;
      };
    }
  }
}

export const Home: FunctionComponent<Props> = (
  { loggedIn, threadsLoginUrl, threadsProfile },
) => {
  const {
    id: profileId,
    username,
    threads_biography,
    threads_profile_picture_url,
  } = threadsProfile || {};
  const threadUsername = `@${username}`;
  return (
    <>
      <div className="background-ribbon"></div>
      <div className="container">
        {!loggedIn && (
          <div className="landing-box">
            <h1 className="title">Red Threads :: Thread Roller</h1>
            <a className="login-button" href={threadsLoginUrl}>
              Log In with Threads Account
            </a>
          </div>
        )}
        {loggedIn && (
          <section className="main">
            <div className="plate">
              <sl-card key={profileId} class="card-overview">
                <img
                  slot="image"
                  src={threads_profile_picture_url}
                  alt={`threads profile photo for ${username}`}
                />

                <strong>
                  <a
                    className="clean"
                    target="_blank"
                    href={`https://www.threads.net/${threadUsername}/`}
                  >
                    {threadUsername}
                  </a>
                </strong>
                <br />
                {threads_biography}
                <br />
                {/* <small>{}</small> */}

                {
                  <div slot="footer">
                    <sl-button variant="warning" size="small">
                      <a className="clean" href="/logout">Log Out</a>
                    </sl-button>
                    {/* <sl-rating></sl-rating> */}
                  </div>
                }
              </sl-card>
              <div className="plate-toolbar">
                <Mentions />
              </div>
            </div>
          </section>
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: css }}></style>
    </>
  );
};
