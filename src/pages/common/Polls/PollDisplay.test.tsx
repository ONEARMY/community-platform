import '@testing-library/jest-dom/vitest';
import { act, render, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@theme-ui/core';
import { Provider } from 'mobx-react';
import { Profile, UserRole } from 'oa-shared';
import { FactoryUser } from 'src/test/factories/User';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { theme } from 'oa-themes';
import { FactoryPollData, FactoryPollOption } from "../../../test/factories/Poll";
import { PollDTO } from "oa-shared/models/poll";
import { PollDisplay } from "./PollDisplay";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";


const activeUser = FactoryUser({
  roles: [UserRole.BETA_TESTER],
}) as Profile;

const mockPoll = FactoryPollData();


describe('Poll', () => {
  afterEach(() => {
    // Clear all mocks after each test to ensure there's no leakage between tests
    vi.clearAllMocks();
  });

  describe('Display', () => {
    it('displays title and options to every user', async () => {
      // Arrange
      mockPoll.title = 'Do you prefer camping near a lake or in a forest?';
      mockPoll.options = [
        FactoryPollOption("Definitely lake!"),
        FactoryPollOption("No, forest!"),
        FactoryPollOption("Both are great.")
      ]

      // Act
      let wrapper;
      act(() => {
        wrapper = getWrapper(mockPoll, activeUser);
      });

      // Assert
      await waitFor(() => {
        const pollDisplay = wrapper.getAllByTestId('pollDisplay');
        expect(pollDisplay).toHaveLength(1);
        expect(pollDisplay[0]).toHaveTextContent('Do you prefer camping near a lake or in a forest?');
        const pollOptions = wrapper.getAllByTestId('pollOption');
        expect(pollOptions).toHaveLength(3);
        expect(pollOptions[0]).toHaveTextContent("Definitely lake!")
        expect(pollOptions[1]).toHaveTextContent("No, forest!")
        expect(pollOptions[2]).toHaveTextContent("Both are great.")
      });
    });

    it('displays results when present', async () => {
      // Arrange
      mockPoll.options = [
        FactoryPollOption("Definitely lake!"),
        FactoryPollOption("No, forest!"),
        FactoryPollOption("Both are great.")
      ]
      mockPoll.options[0].voteCount = 2; // 20%
      mockPoll.options[1].voteCount = 3; // 30%
      mockPoll.options[2].voteCount = 5; // 50%

      mockPoll.options[0].wasVotedByUser = true;

      // Act
      let wrapper;
      act(() => {
        wrapper = getWrapper(mockPoll, activeUser);
      });

      // Assert
      await waitFor(() => {
        const pollOptions = wrapper.getAllByTestId('pollOption');
        expect(pollOptions).toHaveLength(3);
        expect(pollOptions[0]).toHaveTextContent("20%")
        expect(pollOptions[1]).toHaveTextContent("30%")
        expect(pollOptions[2]).toHaveTextContent("50%")
      });
    });
  });

  describe('Voting', () => {
    it('able to vote after option gets selected', async () => {
      // Arrange
      mockPoll.options = [
        FactoryPollOption("Definitely lake!"),
        FactoryPollOption("No, forest!"),
        FactoryPollOption("Both are great.")
      ]
      const user = userEvent.setup();

      // Act
      let wrapper;
      act(() => {
        wrapper = getWrapper(mockPoll, activeUser);
      });

      // Assert: The button is disabled
      await waitFor(() => {
        const submitButton = wrapper.getByRole('button', {
          name: /submit vote/i,
        });
        expect(submitButton).toBeDisabled();
      });

      // Act: select an option
      await user.click(wrapper.getByLabelText('Definitely lake!'));

      // Assert: The button is enabled
      await waitFor(() => {
        const submitButton = wrapper.getByRole('button', {
          name: /submit vote/i,
        });
        expect(submitButton).toBeEnabled();
      });
    });
    it('not able to vote if already voted', async () => {
      // Arrange
      mockPoll.options = [
        FactoryPollOption("Definitely lake!")
      ]
      mockPoll.hasVoted = true;
      const user = userEvent.setup();

      // Act
      let wrapper;
      act(() => {
        wrapper = getWrapper(mockPoll, activeUser);
      });
      await user.click(wrapper.getByLabelText('Definitely lake!'));

      // Assert: The button is disabled
      await waitFor(() => {
        const submitButton = wrapper.getByRole('button', {
          name: /Votes submitted/i,
        });
        expect(submitButton).toBeDisabled();
      });
    });
  });
});

const getWrapper = (poll: PollDTO, profile: Profile) => {
  return render(
    <Provider
      profileStore={{
        user: activeUser,
      }}
    >
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <PollDisplay pollData={poll} profile={profile} />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  );
};
