<?php
declare(strict_types=1);

namespace Stackfactory\SfSeolighthouse\Tests\Unit\Controller;

use TYPO3\TestingFramework\Core\Unit\UnitTestCase;

/**
 * Test case
 *
 * @author Andreas Kauhold <info@stackfactory.de>
 */
class LighthouseStatisticsControllerTest extends UnitTestCase
{
    /**
     * @var \Stackfactory\SfSeolighthouse\Controller\LighthouseStatisticsController
     */
    protected $subject;

    protected function setUp()
    {
        parent::setUp();
        $this->subject = $this->getMockBuilder(\Stackfactory\SfSeolighthouse\Controller\LighthouseStatisticsController::class)
            ->setMethods(['redirect', 'forward', 'addFlashMessage'])
            ->disableOriginalConstructor()
            ->getMock();
    }

    protected function tearDown()
    {
        parent::tearDown();
    }

    /**
     * @test
     */
    public function listActionFetchesAllLighthouseStatisticssFromRepositoryAndAssignsThemToView()
    {
        $allLighthouseStatisticss = $this->getMockBuilder(\TYPO3\CMS\Extbase\Persistence\ObjectStorage::class)
            ->disableOriginalConstructor()
            ->getMock();

        $lighthouseStatisticsRepository = $this->getMockBuilder(\Stackfactory\SfSeolighthouse\Domain\Repository\LighthouseStatisticsRepository::class)
            ->setMethods(['findAll'])
            ->disableOriginalConstructor()
            ->getMock();
        $lighthouseStatisticsRepository->expects(self::once())->method('findAll')->will(self::returnValue($allLighthouseStatisticss));
        $this->inject($this->subject, 'lighthouseStatisticsRepository', $lighthouseStatisticsRepository);

        $view = $this->getMockBuilder(\TYPO3\CMS\Extbase\Mvc\View\ViewInterface::class)->getMock();
        $view->expects(self::once())->method('assign')->with('lighthouseStatisticss', $allLighthouseStatisticss);
        $this->inject($this->subject, 'view', $view);

        $this->subject->listAction();
    }

    /**
     * @test
     */
    public function showActionAssignsTheGivenLighthouseStatisticsToView()
    {
        $lighthouseStatistics = new \Stackfactory\SfSeolighthouse\Domain\Model\LighthouseStatistics();

        $view = $this->getMockBuilder(\TYPO3\CMS\Extbase\Mvc\View\ViewInterface::class)->getMock();
        $this->inject($this->subject, 'view', $view);
        $view->expects(self::once())->method('assign')->with('lighthouseStatistics', $lighthouseStatistics);

        $this->subject->showAction($lighthouseStatistics);
    }

    /**
     * @test
     */
    public function deleteActionRemovesTheGivenLighthouseStatisticsFromLighthouseStatisticsRepository()
    {
        $lighthouseStatistics = new \Stackfactory\SfSeolighthouse\Domain\Model\LighthouseStatistics();

        $lighthouseStatisticsRepository = $this->getMockBuilder(\Stackfactory\SfSeolighthouse\Domain\Repository\LighthouseStatisticsRepository::class)
            ->setMethods(['remove'])
            ->disableOriginalConstructor()
            ->getMock();

        $lighthouseStatisticsRepository->expects(self::once())->method('remove')->with($lighthouseStatistics);
        $this->inject($this->subject, 'lighthouseStatisticsRepository', $lighthouseStatisticsRepository);

        $this->subject->deleteAction($lighthouseStatistics);
    }
}
